import React from 'react';
import { FormattedPriceData, ValidationResult } from '../types/pyth';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface PriceCardProps {
  priceData: FormattedPriceData;
  validation: ValidationResult | null;
  className?: string;
}

export function PriceCard({ priceData, validation, className = '' }: PriceCardProps) {
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatConfidence = (confidence: number): string => {
    return `±$${confidence.toFixed(4)}`;
  };

  const formatAge = (age: number): string => {
    if (age < 60) {
      return `${Math.floor(age)}s ago`;
    } else if (age < 3600) {
      return `${Math.floor(age / 60)}m ago`;
    }
    return `${Math.floor(age / 3600)}h ago`;
  };

  const getPriceChangeColor = (change?: number): string => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (change?: number) => {
    if (!change) return null;
    return change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusColor = (validation: ValidationResult | null): string => {
    if (!validation) return 'bg-gray-100 text-gray-800';
    if (!validation.isValid) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (validation.warnings.length > 0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const getStatusIcon = (validation: ValidationResult | null) => {
    if (!validation) return <Clock className="w-4 h-4" />;
    if (!validation.isValid) return <AlertTriangle className="w-4 h-4" />;
    if (validation.warnings.length > 0) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getConfidenceBarWidth = (confidenceInterval: number): string => {
    const percentage = Math.min(confidenceInterval * 100, 100);
    return `${percentage}%`;
  };

  const getConfidenceBarColor = (confidenceInterval: number): string => {
    if (confidenceInterval <= 0.05) return 'bg-green-500'; // High confidence
    if (confidenceInterval <= 0.1) return 'bg-yellow-500'; // Medium confidence
    return 'bg-red-500'; // Low confidence
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {priceData.symbol}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(validation)}`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(validation)}
              <span>
                {!validation ? 'Loading' : validation.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Zap className="w-4 h-4" />
          <span>{formatAge(priceData.age)}</span>
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(priceData.price)}
          </span>
          {priceData.priceChange !== undefined && (
            <div className={`flex items-center space-x-1 ${getPriceChangeColor(priceData.priceChange)}`}>
              {getPriceChangeIcon(priceData.priceChange)}
              <span className="text-sm font-medium">
                {priceData.priceChangePercent?.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {formatConfidence(priceData.confidence)}
        </div>
      </div>

      {/* Confidence Interval Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Confidence</span>
          <span>{(priceData.confidenceInterval * 100).toFixed(2)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getConfidenceBarColor(priceData.confidenceInterval)}`}
            style={{ width: getConfidenceBarWidth(priceData.confidenceInterval) }}
          />
        </div>
      </div>

      {/* EMA Price */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">EMA Price</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatPrice(priceData.emaPrice)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {formatConfidence(priceData.emaConfidence)}
        </div>
      </div>

      {/* Validation Messages */}
      {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="space-y-2">
          {validation.errors.map((error, index) => (
            <div key={`error-${index}`} className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
          {validation.warnings.map((warning, index) => (
            <div key={`warning-${index}`} className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Published:</span>
            <div>{priceData.publishTime.toLocaleTimeString()}</div>
          </div>
          <div>
            <span className="font-medium">Feed ID:</span>
            <div className="font-mono break-all">
              {priceData.feedId.slice(0, 8)}...{priceData.feedId.slice(-6)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
