package main

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

func ConnnectToClient(redisURL string) *redis.Client {
    opt, err := redis.ParseURL(redisURL)
    if err != nil {
        log.Fatalf("invalid redis url: %v", err)
    }
    return redis.NewClient(opt)
}

func PublishMessage(client *redis.Client, channel string, payload []byte) {
    if err := client.Publish(context.Background(), channel, payload).Err(); err != nil {
        log.Printf("redis publish error: %v", err)
    }
}