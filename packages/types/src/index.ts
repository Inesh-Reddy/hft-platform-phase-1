export interface TickerUpdate {
  exchange: string;
  symbol: string;
  price: string;
  volume?: string;
  eventTime?: number;
}

export interface OrderbookUpdate {
  exchange: string;
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  eventTime?: number;
}

export interface TradeEvent {
  exchange: string;
  symbol: string;
  price: string;
  quantity: string;
  side: "buy" | "sell";
  tradeTime?: number;
}
