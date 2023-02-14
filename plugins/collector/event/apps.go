package event

import (
	"collector/cache/container"
	"collector/cache/process"
	c "collector/container"
	"collector/event/apps"
	"collector/eventmanager"
	"strconv"
	"sync"
	"time"

	"github.com/chriskaliX/SDK"
	"github.com/chriskaliX/SDK/transport/protocol"
	"go.uber.org/zap"

	// force including the applications
	_ "collector/event/apps/language"
	_ "collector/event/apps/midware"
)

type Application struct {
	Apps map[string]apps.IApplication
	once sync.Once
}

func (Application) DataType() int { return 3008 }

func (Application) Flag() int { return eventmanager.Periodic }

func (Application) Name() string { return "application" }

func (Application) Immediately() bool { return false }

// Run over the application recognition plugins
func (a *Application) Run(s SDK.ISandbox, sig chan struct{}) (err error) {
	// inject mapping into application
	a.once.Do(func() {
		a.Apps = apps.Apps
	})
	var pids []int
	var maxProcess = 3000
	pids, err = process.GetPids(maxProcess)
	if err != nil {
		return
	}
	for _, pid := range pids {
		proc, err := process.GetProcessInfo(pid, false)
		if err != nil {
			continue
		}
		time.Sleep(ProcessIntervalMillSec)
		// Actual run function for applications, the applications package is differed by its name
		for k, v := range a.Apps {
			// Skip if did not match the application
			if matched := v.Match(proc); !matched {
				continue
			}
			// Run with the proc, and get information of what we need
			data, err := v.Run(proc)
			if err != nil {
				continue
			}
			var container_id, container_name string
			if proc.Pns != 0 {
				if containerInfo, ok := container.ContainerInfo(uint32(proc.Pns)); ok {
					container_id = containerInfo[c.ContainerId]
					container_name = containerInfo[c.ContainerName]
				}
			}
			// If success, get the container-related fields, the IApplication will not
			// collect this in it's Run function
			// Send record
			s.SendRecord(&protocol.Record{
				DataType:  int32(a.DataType()),
				Timestamp: time.Now().Unix(),
				Data: &protocol.Payload{
					Fields: map[string]string{
						"info":           data, // details or the configuration of all
						"name":           v.Name(),
						"type":           v.Type(),
						"pid":            strconv.Itoa(proc.PID),
						"pns":            strconv.Itoa(proc.Pns),
						"cwd":            proc.Cwd,
						"version":        v.Version(),
						"cmdline":        proc.Argv,
						"pod_name":       proc.PodName,
						"container_id":   container_id,
						"container_name": container_name,
						"uid":            strconv.Itoa(int(proc.UID)),
						"gid":            strconv.Itoa(int(proc.GID)),
						"user":           proc.Username,
						"start_time":     strconv.Itoa(int(proc.StartTime)),
					},
				},
			})
			zap.S().Infof("application collect %s is finished", k)
			goto Next
		}
	Next:
	}
	return nil
}
