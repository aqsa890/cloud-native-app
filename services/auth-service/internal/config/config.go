package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port       string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
}

func LoadConfig() *Config {
	return &Config{
		Port:       getEnv("PORT", "8001"),
		DBHost:     getEnv("MYSQL_HOST", "localhost"),
		DBPort:     getEnv("MYSQL_PORT", "3306"),
		DBUser:     getEnv("MYSQL_USER", "root"),
		DBPassword: getEnv("MYSQL_PASSWORD", "password"),
		DBName:     getEnv("MYSQL_DATABASE", "auth_db"),
		JWTSecret:  getEnv("JWT_SECRET", "default_jwt_secret_key"),
	}
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
