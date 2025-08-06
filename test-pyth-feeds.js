#!/usr/bin/env node

/**
 * Simple test script to verify Pyth Network feed IDs are working correctly
 */

const DEMO_PRICE_FEEDS = [
  {
    symbol: 'SOL/USD',
    feedId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    description: 'Solana / US Dollar',
  },
  {
    symbol: 'BTC/USD',
    feedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    description: 'Bitcoin / US Dollar',
  },
  {
    symbol: 'ETH/USD',
    feedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    description: 'Ethereum / US Dollar',
  },
];

const HERMES_URL = 'https://hermes.pyth.network';

async function testFeedId(feed) {
  try {
    console.log(`Testing ${feed.symbol} (${feed.feedId})...`);
    
    const url = `${HERMES_URL}/api/latest_price_feeds?ids[]=${feed.feedId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No price data received');
    }
    
    const priceData = data[0];
    
    // Verify the response structure
    if (!priceData.id || !priceData.price || !priceData.ema_price) {
      throw new Error('Invalid price data structure');
    }
    
    // Calculate the actual price
    const price = parseFloat(priceData.price.price) * Math.pow(10, priceData.price.expo);
    const confidence = parseFloat(priceData.price.conf) * Math.pow(10, priceData.price.expo);
    const publishTime = new Date(priceData.price.publish_time * 1000);
    
    console.log(`  ✓ ${feed.symbol}: $${price.toFixed(2)} ±$${confidence.toFixed(4)}`);
    console.log(`  ✓ Published: ${publishTime.toISOString()}`);
    console.log(`  ✓ Feed ID matches: ${priceData.id === feed.feedId.replace('0x', '')}`);
    
    return true;
  } catch (error) {
    console.error(`  ✗ Error testing ${feed.symbol}: ${error.message}`);
    return false;
  }
}

async function testAllFeeds() {
  console.log('🧪 Testing Pyth Network Feed IDs...\n');
  
  let successCount = 0;
  
  for (const feed of DEMO_PRICE_FEEDS) {
    const success = await testFeedId(feed);
    if (success) successCount++;
    console.log('');
  }
  
  console.log(`📊 Results: ${successCount}/${DEMO_PRICE_FEEDS.length} feeds working correctly`);
  
  if (successCount === DEMO_PRICE_FEEDS.length) {
    console.log('🎉 All Pyth feed IDs are working correctly!');
    process.exit(0);
  } else {
    console.log('❌ Some feed IDs are not working properly');
    process.exit(1);
  }
}

// Run the tests
testAllFeeds().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
