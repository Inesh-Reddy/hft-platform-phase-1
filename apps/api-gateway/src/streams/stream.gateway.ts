import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';
import { mapRedisTicker, TickerUpdate } from '../../../../packages/types/dist';

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
      (msg: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const newData: TickerUpdate = mapRedisTicker(msg);
        client.send(JSON.stringify(newData));
      },
    );
  };
}
