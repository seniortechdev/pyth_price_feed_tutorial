import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { PythError, PythErrorType } from '../types/pyth';

interface OracleStatusPanelProps {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: PythError | null;
  retryCount: number;
  onRefresh: () => void;
  loading: boolean;
  className?: string;
}

export function OracleStatusPanel({
  isConnected,
  lastUpdate,
  error,
  retryCount,
  onRefresh,
  loading,
  className = ''
}: OracleStatusPanelProps) {
  const getStatusColor = (): string => {
    if (error) return 'text-red-500';
    if (!isConnected) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (!isConnected) return <WifiOff className="w-5 h-5 text-yellow-500" />;
    return <Wifi className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = (): string => {
    if (error) return 'Error';
    if (!isConnected) return 'Disconnected';
    return 'Connected';
  };

  const getErrorTypeIcon = (errorType: PythErrorType) => {
    switch (errorType) {
      case PythErrorType.NETWORK_ERROR:
        return <WifiOff className="w-4 h-4" />;
      case PythErrorType.RATE_LIMITED:
        return <Clock className="w-4 h-4" />;
      case PythErrorType.STALE_PRICE:
        return <Clock className="w-4 h-4" />;
      case PythErrorType.LOW_CONFIDENCE:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatLastUpdate = (date: Date | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Oracle Status
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-pyth-purple hover:bg-pyth-purple/80 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Refresh price data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <div>
          <div className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pyth Hermes API
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="flex items-center space-x-3 mb-4">
        <Activity className="w-5 h-5 text-gray-400" />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            Last Update
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatLastUpdate(lastUpdate)}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-2">
            {getErrorTypeIcon(error.type)}
            <span className="font-medium text-red-800 dark:text-red-200">
              {error.type.replace('_', ' ')}
            </span>
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">
            {error.message}
          </div>
          {retryCount > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              Retry attempt: {retryCount}
            </div>
          )}
        </div>
      )}

      {/* Oracle Type Indicator */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Pull Oracle
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            On-demand updates
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Push Oracle
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Deprecated
          </div>
        </div>
      </div>

      {/* Real-time Indicator */}
      {isConnected && !error && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Real-time updates active</span>
        </div>
      )}

      {/* API Information */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="mb-1">
            <span className="font-medium">Endpoint:</span> Hermes API
          </div>
          <div className="mb-1">
            <span className="font-medium">Network:</span> Solana Devnet
          </div>
          <div>
            <span className="font-medium">Update Interval:</span> 5 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
