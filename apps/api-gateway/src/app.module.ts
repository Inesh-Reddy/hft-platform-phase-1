import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '@repo/dbschema';
import { RedisModule } from './redis/redis.module';
import { MarketsModule } from './markets/markets.module';
import { OrderbookModule } from './orderbook/orderbook.module';
import { TradesModule } from './trades/trades.module';
import { WsGateway } from './streams/stream.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
      migrationsRun: true,
      synchronize: false,
    }),
    RedisModule,
    MarketsModule,
    OrderbookModule,
    TradesModule,
  ],
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {}
