package conf

import (
	"fmt"
	"io/ioutil"
	"os"

	"gopkg.in/yaml.v3"
)

var Config Conf = Conf{}

type Conf struct {
	Mongo struct {
		URI      string `yaml:"uri"`
		PoolSize uint64 `yaml:"pool_size"`
	} `yaml:"mongo"`
	Redis struct {
		Addrs      []string `yaml:"addrs"`
		Mode       int      `yaml:"mode"`
		Password   string   `yaml:"password"`
		MasterName string   `yaml:"mastername"`
	} `yaml:"redis"`
	Backend struct {
		AgentHBOfflineSec      int64 `yaml:"agent_heartbeat_offline_sec"`
		UserSessionLifetimeMin int   `yaml:"user_session_lifetime_min"`
		Auth                   bool  `yaml:"auth"`
	} `yaml:"backend"`
}

func initConfig() error {
	file, err := os.Open("conf.yaml")
	if err != nil {
		return err
	}
	defer file.Close()
	var configFile []byte
	if configFile, err = ioutil.ReadAll(file); err != nil {
		return err
	}
	return yaml.Unmarshal(configFile, &Config)
}

func init() {
	if err := initConfig(); err != nil {
		panic(err)
	}
	fmt.Println(Config)
}
