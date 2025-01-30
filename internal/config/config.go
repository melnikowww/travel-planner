package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	Port string
	DB   struct {
		DSN string
	}
}

func Load() *Config {
	viper.SetConfigFile("config.yaml")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Ошибка чтения конфигурации: %v", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		log.Fatalf("Ошибка разбора конфигурации: %v", err)
	}

	return &cfg
}
