import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(private readonly redisService: RedisService) {}
  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  handleConnection = async (client: WebSocket) => {
    client.send(`Hello Binance`);
    await this.redisService.subscribe(
      'market.ticker.BTCUSDT.binance',
      (msg) => {
        client.send(msg);
      },
    );
  };
}
