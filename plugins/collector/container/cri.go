package container

import (
	"collector/cache/process"
	"context"
	"encoding/json"
	"net"
	"net/url"
	"strconv"
	"strings"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	runtimeapi "k8s.io/cri-api/pkg/apis/runtime/v1"
)

type cri struct{}

var _ Runtime = (*cri)(nil)

// default constants from https://github.com/kubernetes/kubernetes/blob/8a259641532d12f730d0fc6b237d36206d405e52/cmd/kubeadm/app/constants/constants_unix.go
const (
	// CRISocketContainerd is the containerd CRI endpoint
	CRISocketContainerd = "unix:///var/run/containerd/containerd.sock"
	// CRISocketCRIO is the cri-o CRI endpoint
	CRISocketCRIO = "unix:///var/run/crio/crio.sock"
	// CRISocketDocker is the cri-dockerd CRI endpoint
	CRISocketDocker = "unix:///var/run/cri-dockerd.sock"

	DefaultCRISocket = CRISocketContainerd
)

var defaultKnownCRISockets = []string{
	CRISocketContainerd,
	CRISocketCRIO,
	CRISocketDocker,
}

func (c *cri) Runtime() string { return "cri" }

func (c *cri) Containers(ctx context.Context) (cs []Container, err error) {
	endpoints := DetectCRISocket(isExistingSocket)

	if len(endpoints) == 0 {
		return
	}

	for _, endpoint := range endpoints {
		client, conn, err := c.getClient(endpoint)
		if err != nil {
			continue
		}
		resp, err := client.ListContainers(ctx, &runtimeapi.ListContainersRequest{})
		if err != nil {
			conn.Close()
			continue
		}
		for _, container := range resp.Containers {
			con := Container{
				ID:        container.GetId(),
				Names:     []string{container.GetMetadata().GetName()},
				ImageID:   strings.TrimPrefix(container.GetImageRef(), "sha256:"),
				ImageName: strings.TrimPrefix(container.GetImage().GetImage(), "sha256:"),
				State:     strings.ToLower(strings.TrimPrefix(container.GetState().String(), "CONTAINER_")),
				Created:   container.CreatedAt / 1000000000,
				Labels:    container.Labels,
				Endpoint:  endpoint,
			}
			// Only running, get pid & pns
			if ContainerStatus(con.State) == statusRunning {
				if resp, err := client.ContainerStatus(ctx, &runtimeapi.ContainerStatusRequest{ContainerId: container.Id, Verbose: true}); err == nil {
					if pid := c.extraPid(resp.Info); pid != 0 {
						con.PID = pid
						proc := process.Process{PID: int(pid)}
						if err := proc.GetNs(); err == nil {
							con.Pns = uint32(proc.Pns)
						}
					}
					// TODO: REAL IMAGE_NAME? WHY?
				}
			}
			cs = append(cs, con)
		}
		conn.Close()
	}
	return
}

// extra information like PID, there are 2 ways to get this
// Look into: https://github.com/inspektor-gadget/inspektor-gadget/blob/d503dd2d2d1f28224a0983d9700f1c2be1673d7c/pkg/container-utils/cri/cri.go
// It keeps backward compatibility after the ContainerInfo format was modified in:
// cri-o v1.18.0: https://github.com/cri-o/cri-o/commit/be8e876cdabec4e055820502fed227aa44971ddc
// containerd v1.6.0-beta.1: https://github.com/containerd/containerd/commit/85b943eb47bc7abe53b9f9e3d953566ed0f65e6c
// NOTE: CRI-O does not have runtime spec prior to 1.18.0
func (c *cri) extraPid(m map[string]string) (pid uint32) {
	if info, ok := m["info"]; ok {
		var p infoContent
		if err := json.Unmarshal([]byte(info), &p); err == nil {
			pid = uint32(p.Pid)
			return
		}
	} else if pidStr, ok := m["pid"]; ok {
		if id, err := strconv.Atoi(pidStr); err == nil {
			return uint32(id)
		}
	}
	return
}

func (c *cri) getClient(endpoint string) (runtimeapi.RuntimeServiceClient, *grpc.ClientConn, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	conn, err := grpc.DialContext(ctx, endpoint,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.FailOnNonTempDialError(true),
		grpc.WithBlock(),
		grpc.WithReturnConnectionError(),
	)
	if err != nil {
		return nil, nil, err
	}
	// Validation of client working
	client := runtimeapi.NewRuntimeServiceClient(conn)
	if _, err := client.Version(ctx, &runtimeapi.VersionRequest{}); err != nil {
		conn.Close()
		return nil, nil, err
	}
	return client, conn, nil
}

// https://github.com/kubernetes/kubernetes/blob/3eb7b7a48fea4c8bb9a3349f873b452ae6f0a1cc/cmd/kubeadm/app/util/runtime/runtime.go
// DetectCRISocket uses a list of known CRI sockets to detect one. If more than one or none is discovered, an error is returned.
// NOTE: in kubernetes, only one cri is allowed as default
func DetectCRISocket(isSocket func(string) bool) []string {
	// return detectCRISocketImpl(isExistingSocket, defaultKnownCRISockets)
	foundCRISockets := []string{}
	for _, socket := range defaultKnownCRISockets {
		if isSocket(socket) {
			foundCRISockets = append(foundCRISockets, socket)
		}
	}
	return foundCRISockets
}

// https://github.com/kubernetes/kubernetes/blob/8a259641532d12f730d0fc6b237d36206d405e52/cmd/kubeadm/app/util/runtime/runtime_unix.go
// isExistingSocket checks if path exists and is domain socket
func isExistingSocket(path string) bool {
	u, err := url.Parse(path)
	if err != nil {
		// should not happen, since we are trying to access known / hardcoded sockets
		return false
	}
	c, err := net.Dial(u.Scheme, u.Path)
	if err != nil {
		return false
	}
	defer c.Close()
	return true
}

// Inner fields for info, only pid is needed
type infoContent struct {
	Pid int `json:"pid"`
}

func init() {
	registRuntime(&cri{})
}
