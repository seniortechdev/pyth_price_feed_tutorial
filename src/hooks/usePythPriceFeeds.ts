import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PythPriceData,
  FormattedPriceData,
  PriceFeedConfig,
  ValidationResult,
  DemoConfig,
  PythError,
  PythErrorType,
  DEFAULT_DEMO_CONFIG
} from '../types/pyth';

interface UsePythPriceFeedsReturn {
  priceData: Map<string, FormattedPriceData>;
  loading: boolean;
  error: PythError | null;
  lastUpdate: Date | null;
  refreshData: () => Promise<void>;
  validatePrice: (feedId: string) => ValidationResult | null;
  isConnected: boolean;
  retryCount: number;
}

export function usePythPriceFeeds(
  feeds: PriceFeedConfig[],
  config: DemoConfig = DEFAULT_DEMO_CONFIG
): UsePythPriceFeedsReturn {
  const [priceData, setPriceData] = useState<Map<string, FormattedPriceData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PythError | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousPricesRef = useRef<Map<string, number>>(new Map());

  const formatPriceData = useCallback((
    rawData: PythPriceData, 
    feedConfig: PriceFeedConfig
  ): FormattedPriceData => {
    const price = parseFloat(rawData.price.price) * Math.pow(10, rawData.price.expo);
    const confidence = parseFloat(rawData.price.conf) * Math.pow(10, rawData.price.expo);
    const emaPrice = parseFloat(rawData.ema_price.price) * Math.pow(10, rawData.ema_price.expo);
    const emaConfidence = parseFloat(rawData.ema_price.conf) * Math.pow(10, rawData.ema_price.expo);
    
    const publishTime = new Date(rawData.price.publish_time * 1000);
    const age = (Date.now() - publishTime.getTime()) / 1000;
    const isStale = age > config.stalenessThreshold;
    
    const confidenceInterval = confidence / Math.abs(price);
    
    // Calculate price change
    const previousPrice = previousPricesRef.current.get(feedConfig.feedId);
    let priceChange = 0;
    let priceChangePercent = 0;
    
    if (previousPrice && previousPrice !== price) {
      priceChange = price - previousPrice;
      priceChangePercent = (priceChange / previousPrice) * 100;
    }
    
    // Update previous price
    previousPricesRef.current.set(feedConfig.feedId, price);

    return {
      symbol: feedConfig.symbol,
      feedId: feedConfig.feedId,
      price,
      confidence,
      confidenceInterval,
      publishTime,
      age,
      isStale,
      priceChange,
      priceChangePercent,
      emaPrice,
      emaConfidence,
    };
  }, [config.stalenessThreshold]);

  const validatePrice = useCallback((feedId: string): ValidationResult | null => {
    const data = priceData.get(feedId);
    if (!data) return null;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Staleness check
    let staleness: 'fresh' | 'stale' | 'very_stale' = 'fresh';
    if (data.age > config.stalenessThreshold) {
      staleness = data.age > config.stalenessThreshold * 2 ? 'very_stale' : 'stale';
      errors.push(`Price is ${data.age.toFixed(0)}s old (threshold: ${config.stalenessThreshold}s)`);
    }

    // Confidence check
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (data.confidenceInterval > config.confidenceThreshold) {
      confidence = data.confidenceInterval > config.confidenceThreshold * 2 ? 'low' : 'medium';
      const confPercent = (data.confidenceInterval * 100).toFixed(2);
      const thresholdPercent = (config.confidenceThreshold * 100).toFixed(1);
      
      if (confidence === 'low') {
        errors.push(`Low confidence: ±${confPercent}% (threshold: ${thresholdPercent}%)`);
      } else {
        warnings.push(`Medium confidence: ±${confPercent}% (threshold: ${thresholdPercent}%)`);
      }
    }

    // Price reasonableness check
    if (data.price <= 0) {
      errors.push('Invalid price: must be positive');
    }

    // Extreme price movement check
    if (data.priceChangePercent && Math.abs(data.priceChangePercent) > 20) {
      warnings.push(`Large price movement: ${data.priceChangePercent.toFixed(2)}%`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      staleness,
      confidence,
    };
  }, [priceData, config.stalenessThreshold, config.confidenceThreshold]);

  const fetchPriceData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      const feedIds = feeds.map(feed => feed.feedId).join('&ids[]=');
      const url = `${process.env.NEXT_PUBLIC_PYTH_HERMES_URL}/api/latest_price_feeds?ids[]=${feedIds}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: PythPriceData[] = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No price data received');
      }

      const newPriceData = new Map<string, FormattedPriceData>();
      
      data.forEach((priceInfo) => {
        const feedConfig = feeds.find(feed => feed.feedId === priceInfo.id);
        if (feedConfig) {
          const formatted = formatPriceData(priceInfo, feedConfig);
          newPriceData.set(feedConfig.feedId, formatted);
        }
      });

      setPriceData(newPriceData);
      setLastUpdate(new Date());
      setIsConnected(true);
      setRetryCount(0);
      
    } catch (err) {
      console.error('Error fetching price data:', err);
      
      const pythError: PythError = {
        type: err instanceof Error && err.message.includes('HTTP') 
          ? PythErrorType.NETWORK_ERROR 
          : PythErrorType.PARSING_ERROR,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        timestamp: new Date(),
        retryable: true,
      };
      
      setError(pythError);
      setIsConnected(false);
      setRetryCount(prev => prev + 1);
      
      // Don't clear existing data on error, just mark as stale
      if (priceData.size > 0) {
        const updatedData = new Map(priceData);
        updatedData.forEach((data, key) => {
          updatedData.set(key, { ...data, isStale: true });
        });
        setPriceData(updatedData);
      }
    } finally {
      setLoading(false);
    }
  }, [feeds, formatPriceData, priceData]);

  const refreshData = useCallback(async (): Promise<void> => {
    setLoading(true);
    await fetchPriceData();
  }, [fetchPriceData]);

  // Initial fetch and setup interval
  useEffect(() => {
    fetchPriceData();

    if (config.enableRealTimeUpdates) {
      intervalRef.current = setInterval(fetchPriceData, config.refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPriceData, config.enableRealTimeUpdates, config.refreshInterval]);

  // Retry logic
  useEffect(() => {
    if (error && error.retryable && retryCount < config.maxRetries) {
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
      const timeoutId = setTimeout(() => {
        fetchPriceData();
      }, retryDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount, config.maxRetries, fetchPriceData]);

  return {
    priceData,
    loading,
    error,
    lastUpdate,
    refreshData,
    validatePrice,
    isConnected,
    retryCount,
  };
}
