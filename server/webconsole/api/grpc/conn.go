package grpc

import (
	"context"
	"fmt"
	"hboat/api/common"
	"hboat/pkg/basic/mongo"
	"hboat/pkg/conf"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CountRsp struct {
	Total   int64 `json:"total"`
	Online  int64 `json:"online"`
	Offline int64 `json:"offline"`
}

// AgentCount returns the count of agent status.
//
// An agent is online with 2 conditions. status is on, and heartbeat
// available within 30 mins.
func AgentCount(c *gin.Context) {
	total, err := mongo.MongoProxyImpl.StatusC.CountDocuments(context.Background(), bson.D{})
	if err != nil {
		common.Response(c, common.ErrorCode, err.Error())
		return
	}
	// within 5 mins, it's available
	hbEndtime := time.Now().Unix() - conf.Config.Backend.AgentHBOfflineSec
	online, err := mongo.MongoProxyImpl.StatusC.CountDocuments(context.Background(), bson.M{
		"status": true, "last_heartbeat_time": bson.M{"$gt": hbEndtime}})
	if err != nil {
		common.Response(c, common.ErrorCode, err.Error())
		return
	}

	resp := CountRsp{}
	resp.Total = total
	resp.Online = online
	resp.Offline = total - online

	common.Response(c, common.SuccessCode, resp)
}

type ConnStatRsp struct {
	AgentInfo   map[string]interface{}   `json:"agent_info"`
	PluginsInfo []map[string]interface{} `json:"plugins_info"`
	Tags        []string                 `json:"tags"`
}

func AgentStat(c *gin.Context) {
	agentid := c.Query("agent_id")
	var as mongo.AgentStatus
	err := mongo.MongoProxyImpl.StatusC.FindOne(context.Background(), bson.M{"agent_id": agentid}).Decode(&as)
	if err != nil {
		common.Response(c, common.ErrorCode, err.Error())
		return
	}
	// add into agentdetail
	agentInfo := as.AgentDetail
	agentInfo["online"] = as.IsOnline()
	agentInfo["last_heartbeat_time"] = as.LastHBTime
	agentInfo["addr"] = as.Addr

	pluginList := make([]map[string]interface{}, 0, len(as.PluginDetail))
	for k := range as.PluginDetail {
		// 增加状态
		as.PluginDetail[k]["status"] = false
		if hb, ok := as.PluginDetail[k]["last_heartbeat_time"]; ok {
			if hbtime, ok := hb.(int64); ok {
				if time.Now().Unix()-hbtime <= 3*60 {
					as.PluginDetail[k]["status"] = true
				}
			}
		}
		pluginList = append(pluginList, as.PluginDetail[k])
	}

	res := ConnStatRsp{
		AgentInfo:   agentInfo,
		PluginsInfo: pluginList,
		Tags:        as.Tags,
	}

	common.Response(c, common.SuccessCode, res)
}

type AgentBasicResp struct {
	AgentID  string      `json:"agent_id"`
	Hostname interface{} `json:"hostname"`
	Status   bool        `json:"status"`
	CreateAt int64       `json:"create_at"`
	Platform interface{} `json:"platform"`
	Tags     []string    `json:"tags"`
	Cpu      string      `json:"cpu"`
	Mem      string      `json:"mem"`
	Addr     interface{} `json:"addr"`
}

func AgentBasic(c *gin.Context) {
	pageNum := c.GetInt64("pageNum")
	pageSize := c.GetInt64("pageSize")
	skip := (pageNum - 1) * pageSize
	// options
	options := options.Find().SetSort(bson.D{{Key: "create_at", Value: -1}})
	options.Skip = &skip
	options.Limit = &pageSize
	// find
	cur, err := mongo.MongoProxyImpl.StatusC.Find(context.Background(), bson.D{})
	if err != nil {
		common.Response(c, common.ErrorCode, err.Error())
		return
	}
	defer cur.Close(context.Background())
	resList := make([]AgentBasicResp, 0, 10)
	for cur.Next(context.Background()) {
		var as mongo.AgentStatus
		if err := cur.Decode(&as); err != nil {
			continue
		}
		detail := as.AgentDetail
		var cpu, rss float64
		cpu = detail["cpu"].(float64)
		rss = detail["rss"].(float64)
		for _, v := range as.PluginDetail {
			// pass the lost ones
			if time.Now().Unix()-int64(v["last_heartbeat_time"].(float64)) > 180 {
				continue
			}
			cpu += v["cpu"].(float64)
			rss += v["rss"].(float64)
		}

		tmp := AgentBasicResp{
			AgentID:  as.AgentID,
			Hostname: detail["hostname"],
			Status:   as.IsOnline(),
			CreateAt: as.CreateAt,
			Tags:     as.Tags,
			Cpu:      fmt.Sprintf("%.2f", cpu*100),
			Mem:      fmt.Sprintf("%.1f", rss/(1024*1024)),
			Platform: detail["platform"],
			Addr:     as.Addr,
		}
		resList = append(resList, tmp)
	}
	common.Response(c, common.SuccessCode, resList)
}
