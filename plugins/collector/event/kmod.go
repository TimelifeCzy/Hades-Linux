package event

import (
	"bufio"
	"collector/eventmanager"
	"os"
	"strings"
	"time"

	"github.com/chriskaliX/SDK"
	"github.com/chriskaliX/SDK/transport/protocol"
)

type Kmod struct{}

func (Kmod) DataType() int { return 3009 }

func (Kmod) Name() string { return "kmod" }

func (Kmod) Flag() int { return eventmanager.Periodic }

func (Kmod) Immediately() bool { return false }

func (k Kmod) Run(s SDK.ISandbox, sig chan struct{}) (err error) {
	f, err := os.Open("/proc/modules")
	if err != nil {
		return err
	}
	defer f.Close()
	scan := bufio.NewScanner(f)
	for scan.Scan() {
		fields := strings.Fields(scan.Text())
		if len(fields) > 5 {
			s.SendRecord(&protocol.Record{
				DataType:  int32(k.DataType()),
				Timestamp: time.Now().Unix(),
				Data: &protocol.Payload{
					Fields: map[string]string{
						"name":     fields[0],
						"size":     fields[1],
						"refcount": fields[2],
						"used_by":  fields[3],
						"state":    fields[4],
						"addr":     fields[5],
					},
				},
			})
		}
	}
	return nil
}
