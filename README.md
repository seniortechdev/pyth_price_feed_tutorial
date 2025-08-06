# Pyth Price Feeds Demo - Solana Oracle Integration

A live demonstration of Pyth price feeds integration on Solana, showcasing modern pull oracle architecture with real-time price data, security validations, and production-ready patterns.

## 🚀 Live Demo

**[View Live Demo](https://pyth-price-feed-tutorial.vercel.app/)** 

## 📖 Tutorial Integration

This demo application directly implements concepts from our comprehensive **"Using Pyth Price Feeds on Solana with Anchor"** tutorial, demonstrating:

- **Modern Pull Oracle Architecture**: On-demand price updates from Pythnet
- **Security-First Approach**: Staleness checks, confidence validation, and circuit breakers  
- **Real-time Price Monitoring**: Live updates every 5 seconds with error handling
- **Production-Ready Patterns**: Comprehensive validation and error recovery

## ✨ Features

### 🔄 Real-time Price Data
- Live price feeds for SOL/USD, BTC/USD, and ETH/USD
- Automatic updates every 5 seconds
- Price change indicators and trend visualization
- EMA (Exponential Moving Average) price display

### 🛡️ Security Validations
- **Staleness Detection**: Alerts when price data exceeds 60-second threshold
- **Confidence Intervals**: Visual indicators for price uncertainty
- **Circuit Breakers**: Warnings for extreme price movements
- **Error Handling**: Graceful degradation with retry logic

### 📊 Oracle Status Monitoring
- Connection status to Pyth Hermes API
- Last update timestamps and age indicators
- Error reporting with detailed messages
- Retry attempt tracking

### 💻 Developer Experience
- **Code Examples**: Direct integration with tutorial code snippets
- **Interactive UI**: Professional interface suitable for demonstrations
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic theme detection

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Pyth branding
- **Oracle Integration**: Pyth Hermes API for real-time price data
- **Icons**: Lucide React for consistent iconography
- **Deployment**: Vercel (production-ready)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pyth-price-feeds-demo.git
cd pyth-price-feeds-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

### Environment Variables

Create a `.env.local` file (optional - defaults provided):

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PYTH_HERMES_URL=https://hermes.pyth.network
```

## 📁 Project Structure

```
pyth-demo-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Main demo page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── PriceCard.tsx   # Individual price display
│   │   ├── OracleStatusPanel.tsx  # Status monitoring
│   │   └── TutorialSection.tsx    # Tutorial integration
│   ├── hooks/              # Custom React hooks
│   │   └── usePythPriceFeeds.ts   # Price data management
│   └── types/              # TypeScript definitions
│       └── pyth.ts         # Pyth-specific types
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration

### Price Feed Configuration

The demo monitors these price feeds (configurable in `src/types/pyth.ts`):

```typescript
export const DEMO_PRICE_FEEDS: PriceFeedConfig[] = [
  {
    symbol: 'SOL/USD',
    feedId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    description: 'Solana / US Dollar',
    assetType: 'crypto',
  },
  // ... more feeds
];
```

### Demo Settings

Customize behavior in `src/types/pyth.ts`:

```typescript
export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  refreshInterval: 5000,        // Update frequency (ms)
  stalenessThreshold: 60,       // Staleness limit (seconds)
  confidenceThreshold: 0.1,     // Confidence limit (10%)
  maxRetries: 3,               // Error retry attempts
  enableRealTimeUpdates: true, // Auto-refresh toggle
};
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically on push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 Tutorial Connection

This demo directly implements patterns from the tutorial sections:

### Quick Start Implementation
- Demonstrates the 10-minute integration example
- Shows real-world price fetching in action

### Security Best Practices
- Live validation of staleness thresholds
- Confidence interval monitoring
- Error handling demonstrations

### Production Patterns
- Real-time monitoring and alerting
- Graceful error recovery
- Professional UI suitable for production use

## 🤝 Contributing

This demo is part of a QuickNode Technical Writer position submission. For improvements or suggestions:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- **[Complete Tutorial](link-to-tutorial)**: Comprehensive Pyth integration guide
- **[Pyth Network](https://pyth.network/)**: Official Pyth documentation
- **[Solana Docs](https://docs.solana.com/)**: Solana development resources
- **[QuickNode](https://www.quicknode.com/)**: Blockchain infrastructure provider

## 📞 Contact

Built for QuickNode Technical Writer position demonstration.

**Demo Features:**
- ✅ Real-time price feeds with security validations
- ✅ Professional UI suitable for developer demonstrations  
- ✅ Direct tutorial code integration
- ✅ Production-ready error handling
- ✅ Responsive design with dark mode support

---

*This demo showcases production-ready Pyth price feed integration patterns suitable for mainnet deployment.*
