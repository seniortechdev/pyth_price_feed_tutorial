# Deployment Guide - Pyth Price Feeds Demo

This guide covers deploying the Pyth Price Feeds demo application to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/pyth-price-feeds-demo)

### Manual Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (optional)
   - Deploy

3. **Environment Variables** (Optional)
   ```
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_PYTH_HERMES_URL=https://hermes.pyth.network
   ```

## 🌐 Alternative Deployment Options

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=.next
   ```

### Railway

1. **Create railway.json**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/"
     }
   }
   ```

2. **Deploy**
   ```bash
   npm install -g @railway/cli
   railway login
   railway deploy
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   COPY --from=deps /app/node_modules ./node_modules
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t pyth-demo .
   docker run -p 3000:3000 pyth-demo
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_PYTH_HERMES_URL` | Pyth Hermes API URL | `https://hermes.pyth.network` |
| `NEXT_PUBLIC_REFRESH_INTERVAL` | Update interval (ms) | `5000` |
| `NEXT_PUBLIC_STALENESS_THRESHOLD` | Staleness limit (seconds) | `60` |
| `NEXT_PUBLIC_CONFIDENCE_THRESHOLD` | Confidence limit (0-1) | `0.1` |

### Custom Domain Setup

1. **Vercel Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Automatically provided by Vercel
   - No additional configuration needed

## 🔧 Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
   }
   ```

2. **Image Optimization**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['pyth.network'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   ```

### Caching Strategy

1. **Static Assets**
   - Automatically cached by Vercel
   - 1-year cache for static files

2. **API Responses**
   - Pyth API responses cached for 5 seconds
   - Configurable via environment variables

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to Layout**
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Error Monitoring

1. **Sentry Integration**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **API Connection Issues**
   - Check environment variables
   - Verify Hermes API accessibility
   - Check CORS configuration

3. **Performance Issues**
   - Enable compression in next.config.js
   - Optimize images and assets
   - Check network requests in DevTools

### Debug Mode

1. **Enable Debug Logging**
   ```bash
   DEBUG=* npm run dev
   ```

2. **Check Vercel Logs**
   ```bash
   vercel logs [deployment-url]
   ```

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Build completes successfully locally
- [ ] All tests pass
- [ ] Performance optimizations applied
- [ ] Error monitoring configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified
- [ ] Analytics tracking enabled

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Pyth Network API](https://docs.pyth.network/price-feeds/api-reference)
- [Solana RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints)

---

**Need Help?** Check the [GitHub Issues](https://github.com/your-username/pyth-price-feeds-demo/issues) or create a new issue for deployment-related questions.
