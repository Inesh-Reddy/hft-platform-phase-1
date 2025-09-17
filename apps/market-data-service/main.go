package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

func main() {
    cfg := LoadConfig()
    redisClient := ConnnectToClient(cfg.RedisURL)
    defer redisClient.Close()

    out := make(chan []byte, 512)
    ctx, cancel := context.WithCancel(context.Background())

    var wg sync.WaitGroup
    wg.Add(1)
    go func() {
        defer wg.Done()
        ConnectAndStream(ctx, cfg.BinanceWS, out)
    }()

    wg.Add(1)
    go func() {
        defer wg.Done()
        for {
            select {
            case <-ctx.Done():
                return
            case msg := <-out:
                PublishMessage(redisClient, "market.ticker.BTCUSDT.binance", msg)
            }
        }
    }()

    stop := make(chan os.Signal, 1)
    signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
    <-stop
    log.Println("shutting down")
    cancel()

    done := make(chan struct{})
    go func() {
        wg.Wait()
        close(done)
    }()

    select {
    case <-done:
    case <-time.After(10 * time.Second):
    }
    time.Sleep(100 * time.Millisecond)
    log.Println("exited")
}
