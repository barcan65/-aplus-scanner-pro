# A+ Scanner Pro - Professional Edition

Professional stock screening platform with real-time data from Polygon.io, user authentication, and cloud database persistence.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (Authentication + Database + Edge Functions)
- **API**: Polygon.io for real-time stock data
- **State Management**: Zustand
- **Routing**: React Router v6
- **Deployment**: Netlify

## ✨ Features

### 📊 Core Functionality
- **Real-time Stock Scanning**: Pre-market & regular hours
- **A+ Screening Criteria**:
  - Market Cap > $10B
  - Average Volume > 5M shares
  - Price > $5
  - Price above VWAP
  - RSI between 50-70
- **Technical Indicators**: RSI, VWAP, Gap analysis, Float categorization
- **100+ Stock Universe**: Major US equities

### 🔐 Authentication & User Management
- Email/password authentication via Supabase
- Secure session management
- User profiles with API key storage
- Premium subscription tracking

### 💾 Data Persistence
- **Scan History**: Save and review past scans
- **Watchlist**: Track favorite stocks with custom notes and price targets
- **Price Alerts**: Set up alerts (Pro feature)
- All data stored securely in Supabase PostgreSQL

### 🎯 Freemium Model

**FREE TIER**
- Up to 20 stocks per scan
- Manual scans only
- Basic scan history
- Limited watchlist

**PRO TIER ($29/month or $299/year)**
- ✓ Scan 100+ stocks
- ✓ Auto-refresh every 5 minutes
- ✓ Export to CSV/TradeZella
- ✓ Advanced analytics
- ✓ Unlimited scan history
- ✓ Price alerts
- ✓ Pre-market + Regular hours

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Polygon.io API key (free tier available)
- Supabase account (configured automatically)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── Layout.tsx           # Main app layout with navigation
│   ├── pages/
│   │   ├── Login.tsx            # Authentication pages
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Scanner.tsx          # Stock scanner
│   │   ├── History.tsx          # Scan history
│   │   ├── Watchlist.tsx        # User watchlist
│   │   └── Settings.tsx         # User settings & API key
│   ├── store/
│   │   ├── authStore.ts         # Authentication state
│   │   └── scannerStore.ts      # Scanner state
│   ├── lib/
│   │   └── supabase.ts          # Supabase client config
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── supabase/
│   └── functions/
│       └── scan-stocks/         # Edge function for scanning
│           └── index.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── netlify.toml                 # Deployment config
```

## 🗄️ Database Schema

### Tables

**profiles**
- User profiles with premium status
- Stores encrypted Polygon.io API keys
- Tracks premium subscription expiry

**scans**
- Historical scan results
- Stores scan data as JSONB
- Tracks market phase (pre-market/regular)

**watchlist**
- User's tracked stocks
- Custom notes and price targets
- Stop loss levels

**alerts**
- Price alert configurations
- Condition-based triggers
- Active/inactive status

All tables have Row Level Security (RLS) enabled - users can only access their own data.

## 🔧 Configuration

### Environment Variables

Create a `.env` file (already configured):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### User Setup

1. Register a new account
2. Navigate to Settings
3. Enter your Polygon.io API key
4. Start scanning!

## 🚀 Deployment

### Netlify Deployment

The app is configured for automatic Netlify deployment:

```bash
# Build command (automatic)
npm run build

# Output directory
dist/
```

**Deploy to Netlify:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Netlify auto-detects settings from `netlify.toml`
4. Environment variables are automatically configured
5. Deploy!

The app includes SPA routing via Netlify redirects.

## 💳 Payment Integration

### Stripe Setup (Optional)

To enable real payment processing:

1. Create a Stripe account
2. Set up monthly and yearly subscriptions
3. Create Stripe Payment Links
4. Update payment links in the Settings page upgrade section
5. Set up webhooks to update `premium_expires_at` in profiles table

### Webhook Endpoint

Create a Supabase Edge Function to handle Stripe webhooks:
- Update user's `is_premium` status
- Set `premium_expires_at` date
- Handle subscription cancellations

## 🔒 Security

- **Authentication**: Supabase Auth with secure JWT tokens
- **RLS Policies**: Database-level security - users only access their data
- **API Keys**: Stored encrypted in user profiles
- **HTTPS**: Enforced by Netlify
- **Edge Functions**: Proxy Polygon.io requests to keep API keys server-side

## 📊 API Usage

### Polygon.io Requirements

- Free tier: 5 requests/minute
- Paid tier: Recommended for production use
- API calls are batched to respect rate limits

### Edge Function

The `scan-stocks` function:
- Retrieves user's API key from database
- Fetches data from Polygon.io
- Applies A+ screening criteria
- Returns filtered results

## 🎨 Customization

### Screening Criteria

Edit `CONFIG` in `supabase/functions/scan-stocks/index.ts`:

```typescript
const CONFIG = {
  marketCapMin: 10000000000,    // $10B
  avgVolumeMin: 5000000,         // 5M shares
  priceMin: 5,                   // $5
  rsiMin: 50,
  rsiMax: 70,
};
```

### Stock Universe

Modify `STOCK_UNIVERSE` array in the same file to change scanned stocks.

### Pricing

Update pricing in `src/pages/Dashboard.tsx` and `src/pages/Settings.tsx`.

## 📈 Performance

- **Static Frontend**: Fast load times via Vite optimization
- **Code Splitting**: Automatic route-based splitting
- **Edge Functions**: Deployed globally on Supabase
- **Caching**: Browser caching for assets
- **Bundle Size**: ~370KB (gzipped ~105KB)

## 🐛 Troubleshooting

### Common Issues

**Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Auth not working**
- Check Supabase environment variables
- Verify email confirmation is disabled in Supabase dashboard

**Scanner returns no results**
- Verify Polygon.io API key in Settings
- Check market hours
- Review browser console for API errors

## 📝 Legal

### Disclaimer

This tool does NOT provide investment advice or trading recommendations. Users assume 100% of all trading risk. See `terms.html` and `privacy.html` for complete legal terms.

### License

Created by **THE COVENANT BRIDGE FINANCIAL GROUP LLC**
Rev. Barry Cannon, MSN, RN, PMP, ITIL v4

## 🤝 Support

For technical support:
- Check browser console (F12) for errors
- Verify API key configuration
- Review Supabase logs for backend errors
- Email: support@aplusscanner.com

---

**Version 2.0** - Professional React Edition
