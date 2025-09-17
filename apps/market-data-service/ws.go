package main

import (
	"context"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

func ConnectAndStream(ctx context.Context, wsURL string, out chan<- []byte) {
    backoff := time.Second * 2
    for {
        select {
        case <-ctx.Done():
            return
        default:
        }

        conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
        if err != nil {
            log.Printf("ws dial error: %v; retry in %s", err, backoff)
            time.Sleep(backoff)
            if backoff < time.Minute {
                backoff *= 2
            }
            continue
        }
        log.Println("ws connected:", wsURL)
        backoff = time.Second * 2

        for {
            _, msg, err := conn.ReadMessage()
            if err != nil {
                log.Printf("ws read error: %v", err)
                _ = conn.Close()
                break
            }
            select {
            case out <- msg:
            case <-ctx.Done():
                _ = conn.Close()
                return
            case <-time.After(2 * time.Second):
            }
        }
        time.Sleep(2 * time.Second)
    }
}
