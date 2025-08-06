'use client';

import React, { useState } from 'react';
import { PriceCard } from '../components/PriceCard';
import { OracleStatusPanel } from '../components/OracleStatusPanel';
import { TutorialSection } from '../components/TutorialSection';
import { usePythPriceFeeds } from '../hooks/usePythPriceFeeds';
import { DEMO_PRICE_FEEDS, DEFAULT_DEMO_CONFIG } from '../types/pyth';
import { 
  Activity, 
  Zap, 
  Shield, 
  ExternalLink,
  Github,
  BookOpen,
  Settings
} from 'lucide-react';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    priceData,
    loading,
    error,
    lastUpdate,
    refreshData,
    validatePrice,
    isConnected,
    retryCount,
  } = usePythPriceFeeds(DEMO_PRICE_FEEDS, DEFAULT_DEMO_CONFIG);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-pyth-purple" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pyth Price Feeds Demo
                </h1>
              </div>
              <span className="px-3 py-1 bg-pyth-purple/10 text-pyth-purple text-sm font-medium rounded-full">
                Live Demo
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <a
                href="https://github.com/your-username/pyth-price-feeds-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pyth-purple to-pyth-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pyth Price Feeds on Solana
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Live demonstration of modern pull oracle integration with real-time price data, 
              security validations, and production-ready patterns from our comprehensive tutorial.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Activity className="w-5 h-5" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5" />
                <span>Security Validations</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Zap className="w-5 h-5" />
                <span>Pull Oracle Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <OracleStatusPanel
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              error={error}
              retryCount={retryCount}
              onRefresh={refreshData}
              loading={loading}
            />
          </div>
          
          <div className="lg:col-span-2">
            <TutorialSection />
          </div>
        </div>

        {/* Price Cards Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Live Price Feeds
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Updates every 5 seconds</span>
            </div>
          </div>
          
          {loading && priceData.size === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEMO_PRICE_FEEDS.map((feed) => {
                const data = priceData.get(feed.feedId);
                const validation = data ? validatePrice(feed.feedId) : null;
                
                return data ? (
                  <PriceCard
                    key={feed.feedId}
                    priceData={data}
                    validation={validation}
                  />
                ) : (
                  <div key={feed.feedId} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <div>Loading {feed.symbol}...</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tutorial CTA */}
        <div className="bg-gradient-to-r from-pyth-purple/10 to-pyth-blue/10 rounded-lg p-8 border border-pyth-purple/20">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-pyth-purple mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Learn How to Build This
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              This demo showcases concepts from our comprehensive Pyth price feeds tutorial. 
              Learn how to integrate reliable, real-time price data into your Solana applications 
              with production-ready security practices.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="flex items-center space-x-2 px-6 py-3 bg-pyth-purple hover:bg-pyth-purple/80 text-white rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read Full Tutorial</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <a
                href="https://github.com/your-username/pyth-price-feeds-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>View Source Code</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Built for the QuickNode Technical Writer position demonstration
            </p>
            <p className="text-sm">
              Showcasing production-ready Pyth price feed integration on Solana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
