export type StockQuote = {
  price: number;
  high_day: number;
  low_day: number;
  open_day: number;
  prev_close: number;
  timestamp: Date;
};

export interface StockQuoter {
  getQuote(symbol: string): Promise<StockQuote | null>;

  matchSymbol(symbol: string): Promise<boolean>;
}
