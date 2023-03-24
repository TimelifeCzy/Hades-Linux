package plugin

import (
	"agent/agent"
	"agent/transport"
	"context"
	"fmt"
	"sync"

	"github.com/chriskaliX/SDK/transport/protocol"
	"go.uber.org/zap"
)

func Startup(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	defer zap.S().Info("plugin deamon exits")
	zap.S().Info("plugin deamon starts")
	for {
		select {
		case <-ctx.Done():
			PluginManager.unRegistAll()
			return
		// Task 处理
		case task := <-transport.PluginTaskChan:
			plg, ok := PluginManager.Get(task.ObjectName)
			if !ok {
				transport.TaskError(task.Token, fmt.Sprintf("can't find plugin %s", task.ObjectName))
				continue
			}
			if err := plg.SendTask((protocol.Task)(*task)); err != nil {
				transport.TaskError(task.Token, fmt.Sprintf("send task to plugin: %s", err.Error()))
			} else {
				transport.TaskSuccess(task.Token, "")
			}
		// Config 处理
		case cfgs := <-transport.PluginConfigChan:
			// 加载插件
			for _, cfg := range cfgs {
				if cfg.Name == agent.Product {
					continue
				}
				if err := PluginManager.Load(ctx, *cfg); err != nil && err != ErrIngore {
					zap.S().Errorf("plugin %s load failed: %s", cfg.Name, err.Error())
				} else {
					zap.S().Infof("plugin %s is loaded successfully", cfg.Name)
				}
			}
			// 移除插件
			for _, plg := range PluginManager.GetAll() {
				if _, ok := cfgs[plg.Name()]; ok {
					continue
				}
				if err := PluginManager.unRegist(plg.Name()); err != nil {
					zap.S().Errorf("plugin %s remove failed: %s", plg.Name(), err.Error())
				} else {
					zap.S().Infof("plugin %s is removed", plg.Name())
				}
			}
		}
	}
}
