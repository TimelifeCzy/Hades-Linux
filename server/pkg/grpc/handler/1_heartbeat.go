package handler

import (
	"context"
	"hboat/pkg/basic/mongo"
	"hboat/pkg/grpc/transfer/pool"
	pb "hboat/pkg/grpc/transfer/proto"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

type Heartbeat struct{}

var _ Event = (*Heartbeat)(nil)

func (h *Heartbeat) ID() int32 { return 1 }

func (h *Heartbeat) Name() string { return "heartbeat" }

func (h *Heartbeat) Handle(m map[string]string, req *pb.RawData, conn *pool.Connection) error {
	intranet_ipv4 := strings.Join(req.IntranetIPv4, ",")
	intranet_ipv6 := strings.Join(req.IntranetIPv6, ",")
	extranet_ipv4 := strings.Join(req.ExtranetIPv4, ",")
	extranet_ipv6 := strings.Join(req.ExtranetIPv6, ",")
	data := make(map[string]interface{}, 40)
	data["intranet_ipv4"] = intranet_ipv4
	data["intranet_ipv6"] = intranet_ipv6
	data["extranet_ipv4"] = extranet_ipv4
	data["extranet_ipv6"] = extranet_ipv6
	data["product"] = req.Product
	data["hostname"] = req.Hostname
	data["version"] = req.Version
	for k, v := range m {
		switch k {
		case "platform_version", "version":
			data[k] = v
		default:
			fv, err := strconv.ParseFloat(v, 64)
			if err == nil {
				data[k] = fv
			} else {
				data[k] = v
			}
		}
	}
	conn.LastHBTime = time.Now().Unix()
	if _, err := mongo.StatusC.UpdateOne(context.Background(), bson.M{"agent_id": req.AgentID},
		bson.M{"$set": bson.M{"agent_detail": data, "last_heartbeat_time": conn.LastHBTime}}); err != nil {
		return err
	}
	conn.SetAgentDetail(data)
	return nil
}

func init() {
	RegistEvent(&Heartbeat{})
}
