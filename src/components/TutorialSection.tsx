import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight,
  GitBranch,
  Zap,
  Shield,
  TestTube
} from 'lucide-react';

interface TutorialSectionProps {
  className?: string;
}

interface CodeExample {
  title: string;
  language: string;
  code: string;
  description: string;
}

const codeExamples: CodeExample[] = [
  {
    title: 'Fetch Price (Pull Oracle)',
    language: 'rust',
    description: 'Modern pull oracle implementation with security validations',
    code: `use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

pub fn fetch_price_pull(ctx: Context<FetchPricePull>) -> Result<()> {
    let price_update = &ctx.accounts.price_update;
    let price = price_update.get_price_unchecked();
    
    // Validate staleness (60 seconds)
    let clock = Clock::get()?;
    if clock.unix_timestamp - price.publish_time > 60 {
        return Err(ErrorCode::StalePriceFeed.into());
    }
    
    // Validate confidence
    let confidence_ratio = (price.conf as f64) / (price.price.abs() as f64);
    if confidence_ratio > 0.1 {
        return Err(ErrorCode::LowConfidencePrice.into());
    }
    
    msg!("Price: {:.2}", (price.price as f64) * 10f64.powi(price.expo));
    Ok(())
}`
  },
  {
    title: 'Client Integration',
    language: 'typescript',
    description: 'TypeScript client for submitting price updates',
    code: `import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";

async function updatePrice() {
    // Fetch VAA from Hermes API
    const response = await fetch(
        \`https://hermes.pyth.network/api/latest_price_feeds?ids[]=\${feedId}\`
    );
    const data = await response.json();
    
    // Submit price update
    const priceUpdateAccount = await pythReceiver.postPriceUpdate({
        priceFeedId: feedId,
        vaa: data[0].vaa,
    });
    
    // Use in your program
    await program.methods.fetchPricePull()
        .accounts({ priceUpdate: priceUpdateAccount })
        .rpc();
}`
  },
  {
    title: 'Security Validation',
    language: 'rust',
    description: 'Production-ready price validation with circuit breakers',
    code: `fn validate_price(price: &Price, old_price: i64) -> Result<()> {
    // Staleness check
    let age = Clock::get()?.unix_timestamp - price.publish_time;
    if age > STALENESS_THRESHOLD {
        return Err(ErrorCode::StalePriceFeed.into());
    }
    
    // Confidence check
    let confidence_ratio = (price.conf as f64) / (price.price.abs() as f64);
    if confidence_ratio > CONFIDENCE_THRESHOLD {
        return Err(ErrorCode::LowConfidencePrice.into());
    }
    
    // Circuit breaker for extreme movements
    let change_ratio = ((price.price - old_price).abs() as f64) / (old_price.abs() as f64);
    if change_ratio > EXTREME_MOVEMENT_THRESHOLD {
        return Err(ErrorCode::ExtremeePriceMovement.into());
    }
    
    Ok(())
}`
  }
];

export function TutorialSection({ className = '' }: TutorialSectionProps) {
  const [expandedExample, setExpandedExample] = useState<number | null>(0);

  const toggleExample = (index: number) => {
    setExpandedExample(expandedExample === index ? null : index);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Book className="w-6 h-6 text-pyth-purple" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Tutorial Integration
        </h2>
      </div>

      {/* Description */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          This live demo showcases the concepts covered in our comprehensive Pyth price feeds tutorial. 
          The code examples below are taken directly from the tutorial and demonstrate production-ready 
          integration patterns.
        </p>
      </div>

      {/* Tutorial Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Pull Oracle Focus</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modern on-demand architecture</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Shield className="w-5 h-5 text-green-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Security First</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Comprehensive validation</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <TestTube className="w-5 h-5 text-blue-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Testing Excellence</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unit & integration tests</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <GitBranch className="w-5 h-5 text-purple-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Migration Guide</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Push to pull transition</div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Code className="w-5 h-5" />
          <span>Code Examples from Tutorial</span>
        </h3>
        
        {codeExamples.map((example, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExample(index)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {expandedExample === index ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {example.title}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded text-gray-700 dark:text-gray-300">
                  {example.language}
                </span>
              </div>
            </button>
            
            {expandedExample === index && (
              <div className="p-4 bg-white dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {example.description}
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{example.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tutorial Links */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Complete Tutorial Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="#"
            className="flex items-center space-x-2 p-3 bg-pyth-purple hover:bg-pyth-purple/80 text-white rounded-lg transition-colors"
          >
            <Book className="w-4 h-4" />
            <span>Full Tutorial</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
          
          <a
            href="#"
            className="flex items-center space-x-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>
      </div>

      {/* Tutorial Highlights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-pyth-purple/10 to-pyth-blue/10 rounded-lg border border-pyth-purple/20">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Tutorial Highlights
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Quick Start: Get running in 10 minutes</li>
          <li>• Production patterns with security best practices</li>
          <li>• Comprehensive testing framework</li>
          <li>• Real-world DeFi use cases</li>
          <li>• Migration guide from push to pull oracles</li>
          <li>• Monitoring and deployment guidance</li>
        </ul>
      </div>
    </div>
  );
}
