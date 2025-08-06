// Pyth price feed types and interfaces

export interface PythPriceData {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  vaa?: string;
}

export interface FormattedPriceData {
  symbol: string;
  feedId: string;
  price: number;
  confidence: number;
  confidenceInterval: number;
  publishTime: Date;
  age: number;
  isStale: boolean;
  priceChange?: number;
  priceChangePercent?: number;
  emaPrice: number;
  emaConfidence: number;
}

export interface PriceFeedConfig {
  symbol: string;
  feedId: string;
  description: string;
  assetType: 'crypto' | 'equity' | 'fx' | 'commodity';
  baseAsset: string;
  quoteAsset: string;
  legacyAddress?: string; // For push oracle compatibility
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  staleness: 'fresh' | 'stale' | 'very_stale';
  confidence: 'high' | 'medium' | 'low';
}

export interface OracleStatus {
  type: 'push' | 'pull';
  isConnected: boolean;
  lastUpdate: Date | null;
  errorCount: number;
  successRate: number;
}

export interface DemoConfig {
  refreshInterval: number; // milliseconds
  stalenessThreshold: number; // seconds
  confidenceThreshold: number; // percentage (0-1)
  maxRetries: number;
  enableRealTimeUpdates: boolean;
}

// Price feed configurations for the demo
export const DEMO_PRICE_FEEDS: PriceFeedConfig[] = [
  {
    symbol: 'SOL/USD',
    feedId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    description: 'Solana / US Dollar',
    assetType: 'crypto',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    legacyAddress: 'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix',
  },
  {
    symbol: 'BTC/USD',
    feedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    description: 'Bitcoin / US Dollar',
    assetType: 'crypto',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    legacyAddress: 'HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J',
  },
  {
    symbol: 'ETH/USD',
    feedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    description: 'Ethereum / US Dollar',
    assetType: 'crypto',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    legacyAddress: 'EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw',
  },
];

// Default demo configuration
export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  refreshInterval: 5000, // 5 seconds
  stalenessThreshold: 60, // 60 seconds
  confidenceThreshold: 0.1, // 10%
  maxRetries: 3,
  enableRealTimeUpdates: true,
};

// Error types
export enum PythErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_FEED_ID = 'INVALID_FEED_ID',
  STALE_PRICE = 'STALE_PRICE',
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
  PARSING_ERROR = 'PARSING_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
}

export interface PythError {
  type: PythErrorType;
  message: string;
  feedId?: string;
  timestamp: Date;
  retryable: boolean;
}
