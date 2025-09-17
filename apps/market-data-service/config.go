package main

import "os"

type Config struct {
    BinanceWS string
    RedisURL  string
}

func LoadConfig() Config {
    ws := getEnv("BINANCE_WS", "wss://stream.binance.com:9443/ws/btcusdt@ticker")
    return Config{
        BinanceWS: ws,
        RedisURL:  getEnv("REDIS_URL", "redis://localhost:6379"),
    }
}

func getEnv(k, fallback string) string {
    if v, ok := os.LookupEnv(k); ok {
        return v
    }
    return fallback
}
