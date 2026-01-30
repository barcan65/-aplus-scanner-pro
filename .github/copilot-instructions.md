# A+ Scanner Pro - AI Agent Instructions

## Project Overview
A+ Scanner Pro is a **stock market screener web application** powered by Polygon.io API. It identifies high-potential trading opportunities by scanning S&P 100 stocks against technical and fundamental criteria. The app runs locally via Python's HTTP server and works in any modern browser.

**Key Facts:**
- Single-page HTML application (no build step, pure vanilla JavaScript + HTML/CSS)
- Designed for pre-market and regular trading hours analysis
- Built by ChartScript AI LLC for professional traders
- Three deployment options: local server, CORS extension, or web hosting

---

## Architecture & Key Components

### Application Flow
1. **User Input** → API key entry (stored in localStorage)
2. **Market Hours Check** → Determines pre-market vs. regular hours mode
3. **Data Fetch** → Polygon.io API retrieves 4-week price/volume data for each stock
4. **Technical Analysis** → Calculate RSI, VWAP, market cap per stock
5. **Filtering** → Apply A+ criteria (market cap, volume, RSI, price vs VWAP)
6. **Display** → Render results table with export to TradeZella CSV

### Main Files
- **aplus-polygon-scanner.html** (967 lines) - Complete app (HTML + CSS + JavaScript)
  - Scan logic, API integration, UI controls, export functionality
- **polygon-api-tester.html** - Debugging tool to test API connectivity
- **CORS-FIX-INSTRUCTIONS.html** - Setup guide for 4 deployment options
- **START_SCANNER_SERVER.bat** - Windows launcher (Python HTTP server on port 8000)
- **start_scanner_server.sh** - Mac/Linux launcher

### Critical Configuration (Lines 502-511 in aplus-polygon-scanner.html)
```javascript
const CONFIG = {
  marketCapMin: 10000000000,  // $10B minimum market cap
  avgVolumeMin: 5000000,       // 5M shares average volume
  priceMin: 5,                 // Stock price floor
  rsiMin: 50,                  // Relative Strength Index range
  rsiMax: 70
};

const STOCK_UNIVERSE = [
  // 100 S&P stocks: AAPL, MSFT, GOOGL, AMZN, NVDA, etc.
];
```

---

## Critical Developer Workflows

### Running the Scanner (User Perspective)
**Windows:**
1. Ensure Python installed: `python --version`
2. Double-click `START_SCANNER_SERVER.bat`
3. Open browser to `http://localhost:8000/aplus-polygon-scanner.html`
4. Enter Polygon.io API key (free tier available)
5. Click "▶ Run Scan"

**Mac/Linux:**
```bash
chmod +x start_scanner_server.sh
./start_scanner_server.sh
```

### Local Development
- **No build process needed** - edit HTML directly, refresh browser
- **Port 8000** is hardcoded in START_SCANNER_SERVER.bat
- Changes to JavaScript are live (just refresh page)
- Polygon API calls require valid API key

### Testing/Debugging
1. **polygon-api-tester.html** - Standalone tool to validate API connectivity before scanning
2. Browser DevTools (F12) - Check Console for API errors, Network tab for request/response
3. localStorage inspection - Verify API key is saved (`localStorage.getItem('polygonApiKey')`)

---

## Project-Specific Patterns & Conventions

### A+ Screening Criteria
The `meetsAPlusCriteria()` function (line 804) filters stocks using these rules:
```javascript
function meetsAPlusCriteria(stock) {
  return (
    stock.marketCap > CONFIG.marketCapMin &&
    stock.avgVolume > CONFIG.avgVolumeMin &&
    stock.price > CONFIG.priceMin &&
    stock.price > stock.vwap &&           // Price must exceed VWAP
    stock.rsi >= CONFIG.rsiMin &&
    stock.rsi <= CONFIG.rsiMax
  );
}
```
**Key insight:** All criteria must pass (AND logic); modify CONFIG object to adjust sensitivity.

### Market Hours Detection
- **`isMarketHours()`** (line 585) - Regular hours: 9:30 AM - 4:00 PM ET
- **`isPreMarket()`** (line 599) - Pre-market: 4:00 AM - 9:30 AM ET
- Uses Eastern Time; affects scan mode and data availability

### Technical Indicators
- **RSI Calculation** (line 649) - 14-period Relative Strength Index
- **VWAP Calculation** (line 671) - Volume Weighted Average Price (4-week window)
- **Polygon API** - Fetches `agg` (aggregates) endpoint for OHLCV data

### API Integration
- **Endpoint:** `https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start}/{end}`
- **Rate Limits:** Free tier ~5 calls/min; implement delays between stock fetches
- **Error Handling:** Failed requests log to console; missing stocks don't block scan
- **localStorage:** API key persisted to avoid re-entry

### Data Export
- **exportToTradeZella()** (line 943) - Generates CSV with columns: Symbol, Price, Change, RSI, VWAP, Market Cap
- CSV downloadable as `aplus-scan-results-[timestamp].csv`
- Import-ready for trading platforms

### Auto-Refresh Logic
- **handleAutoRefreshToggle()** (line 998) - Toggle checkbox enables/disables auto-scan
- **startAutoRefresh()** (line 1011) - Runs scans every 5 minutes during market hours
- **stopAutoRefresh()** (line 1031) - Clears interval

---

## Integration Points & External Dependencies

### Polygon.io API
- **Dependency:** Internet connection required
- **Authentication:** API key required (free account at polygon.io)
- **Data:** Daily aggregates (OHLCV), 4-week history per stock
- **Cost:** Free tier sufficient for occasional use; premium for high-frequency
- **Rate Limits:**
  - **Free Tier:** ~5 API calls/minute; 100 calls/day soft limit
  - **Premium Tiers:** Scale from 15 calls/min to unlimited
  - **Scanner Impact:** Scanning 100 stocks at 5 calls/min = 20 minutes per full scan
- **Backoff Strategy:** Current implementation has no retry logic; add delays between batches:
  ```javascript
  // Example: Add 200ms delay between stock fetches in fetchStockData loop
  await new Promise(resolve => setTimeout(resolve, 200));
  ```

### Deployment Environment
1. **Local (Recommended):** Python 3.6+ with built-in http.server module
   - **Command:** `python -m http.server 8000` from scanner directory
   - **Pros:** Zero CORS issues, works offline, fastest, most secure
   - **Cons:** Terminal must stay open; not accessible from other machines
   - **Setup:** Just run START_SCANNER_SERVER.bat (Windows) or start_scanner_server.sh (Mac/Linux)

2. **Chrome Extension (Quick Test):** "Allow CORS: Access-Control-Allow-Origin"
   - **Extension ID:** lhobafahddgcelffkeicbaginigeejlf (Chrome Web Store)
   - **Setup:** Install → Click icon to toggle ON (turns orange) → Reload scanner page
   - **Pros:** 30-second setup; works immediately; no command line needed
   - **Cons:** Chrome/Edge only; security risk (disables CORS globally); must disable after use
   - **Best For:** Quick testing, not production

3. **Web Hosting (Production/Team):** Netlify, Vercel, or GitHub Pages
   - **Netlify:** Drag-drop HTML files to netlify.com/drop → Instant live URL
   - **Vercel:** Connect GitHub repo → Automatic deployments
   - **GitHub Pages:** Push to gh-pages branch → Free hosting with GitHub account
   - **Pros:** Accessible anywhere; shareable link; mobile compatible; always available
   - **Cons:** Requires hosting setup; exposes HTML code publicly
   - **Security:** **CRITICAL** - Never hardcode API key in HTML for public hosting. Instead:
     - Option A: Use environment variable + build process (requires backend)
     - Option B: Deploy with backend proxy (Node.js/Python) to hide API key
     - Option C: Prompt user for API key at runtime (current approach - acceptable for private use)

4. **VS Code Live Server (Developer):** Extension for local development
   - **Install:** VS Code → Extensions → Search "Live Server" → Install by Ritwick Dey
   - **Usage:** Right-click aplus-polygon-scanner.html → "Open with Live Server"
   - **URL:** Opens at http://127.0.0.1:5500/aplus-polygon-scanner.html automatically
   - **Pros:** Auto-refresh on file save; integrates with VS Code; great for editing
   - **Cons:** Requires VS Code; only for development

2. **Browser:** Chrome, Edge, Firefox, Safari (ES6 JavaScript support)
3. **CORS Solutions:**
   - Local server (recommended) - no CORS issues
   - Chrome extension (Allow CORS) - easy but less secure
   - Web hosting (Netlify, Vercel, GitHub Pages) - requires backend proxy for API key security

### Data Storage
- **localStorage** - Persists API key in browser (not encrypted)
- **Session state** - `currentResults` array holds latest scan results (in-memory only)
- **No backend database** - This is a client-side application

---

## Testing & Development Without Live API

### Offline Mock Data Testing
For development without hitting Polygon.io limits, inject mock data:

```javascript
// In browser Console (F12), override fetchStockData():
const MOCK_DATA = {
  'AAPL': {
    symbol: 'AAPL',
    price: 185.50,
    marketCap: 2800000000000,
    avgVolume: 52000000,
    rsi: 62.3,
    vwap: 183.20,
    change: 2.30,
    changePercent: 1.26
  }
  // ... add more stocks as needed
};

// Replace the real API call:
async function fetchStockData(symbol) {
  if (MOCK_DATA[symbol]) {
    return { status: 'OK', results: [MOCK_DATA[symbol]] };
  }
  // ... fall through to real API if not in mock data
}
```

### Create a Mock Data HTML File
1. Copy aplus-polygon-scanner.html → aplus-polygon-scanner-mock.html
2. Replace line 687's fetchStockData function with mock version above
3. Include 20-30 realistic stocks with varied scan results
4. Use for UI testing, threshold testing, export testing without API dependency

### Browser DevTools for Testing
- **Console:** Inspect `currentResults` array to see parsed stock data
- **Network Tab:** Monitor Polygon API calls, check response times, identify rate limit errors
- **Application Tab:** View localStorage (check API key storage, clear if needed)
- **Inspect Elements:** Test responsive design at different window sizes

### Unit Testing Quick Checks
```javascript
// In Console, test technical indicator functions:
console.log(calculateRSI([100, 102, 101, 103, 102])); // Should return 0-100
console.log(calculateVWAP([{c: 100, v: 1000}, {c: 101, v: 900}])); // Check formula
console.log(meetsAPlusCriteria({marketCap: 15000000000, avgVolume: 6000000, price: 150, vwap: 145, rsi: 60, change: 2})); // Should return true
```

---

## API Key Security & Team Deployments

### For Personal/Local Use
**Current approach is acceptable:**
- API key stored in localStorage (single machine)
- Not transmitted to external servers
- Can be cleared with "Clear localStorage" button
- Limitation: Key visible in browser DevTools (acceptable for private use)

### For Team Deployments (Production)
**DO NOT commit API key to Git or hardcode in HTML:**

**Option 1: Environment Variables + Backend Proxy (Recommended)**
```javascript
// Instead of direct API calls, call your backend:
async function fetchStockData(symbol) {
  // Backend at /api/stock/:symbol handles Polygon API call
  const response = await fetch(`/api/stock/${symbol}`);
  const data = await response.json();
  return data;
}
```
Backend (Node.js example):
```javascript
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
app.get('/api/stock/:symbol', (req, res) => {
  // Make Polygon API call server-side with secret key
  // Return sanitized data to frontend (no key exposure)
});
```

**Option 2: API Key at Runtime (User-Provided)**
- Current implementation: each user provides their own Polygon.io API key
- Pros: No server needed; each user controls their own quota
- Cons: Requires distributing deployment instructions; users must sign up for Polygon account

**Option 3: Rate-Limited API Gateway**
- Deploy shared backend that handles rate limiting and caching
- Distribute requests across multiple API keys
- Cache results (5-min TTL) to reduce API calls
- Implement per-user request limits

### Git/Version Control Safety
```bash
# Add to .gitignore (if you create one):
*.key
*.env
.env.local
config.local.js

# Never commit:
# - API keys in HTML
# - localStorage dumps
# - Trading credentials
```

### Monitoring API Usage
- Log API calls to track quota usage: `console.log(`Fetching ${symbol}... (${currentIndex}/${STOCK_UNIVERSE.length})`);`
- Check Polygon.io dashboard for monthly usage patterns
- Alert users when approaching rate limits: `Slowing scan to respect API limits...`
- Consider adding quota indicator: "150/500 API calls used today"

---

## Polygon.io API Reference

### Authentication & Setup
1. **Create Free Account:** polygon.io → Sign up (Google/GitHub)
2. **Get API Key:** Dashboard → API Keys → Copy your FREE tier key
3. **Store Locally:** Paste into scanner's "API Key" input field → Auto-saved to localStorage
4. **No Expiration:** Free API keys don't expire; you can rotate them in dashboard anytime

### API Endpoint Used
```
GET https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date}/{end_date}
```

**Parameters:**
- `symbol`: Stock ticker (e.g., "AAPL")
- `start_date`: YYYY-MM-DD format (4 weeks back from today)
- `end_date`: Today's date
- `apikey`: Your Polygon.io API key (appended as query param)

**Sample Response:**
```json
{
  "status": "OK",
  "results": [
    {
      "v": 52000000,          // Volume
      "vw": 183.25,           // Volume Weighted Price (basis for VWAP)
      "o": 182.50,            // Open
      "c": 185.50,            // Close (current price)
      "h": 186.00,            // High
      "l": 182.00,            // Low
      "t": 1674864000000      // Timestamp (milliseconds)
    }
  ]
}
```

### Tier Comparison
| Feature | Free | Starter | Professional |
|---------|------|---------|--------------|
| API Calls/Min | 5 | 15 | 300+ |
| Daily Limit | 100 | 1000 | Unlimited |
| Historical Data | Yes | Yes | Yes |
| Real-time Quotes | Yes (15min delay) | Yes (live) | Yes (live) |
| Cost | Free | ~$100/mo | $500+/mo |
| Recommended For | Casual scanning | Regular traders | High-frequency |

### Pre-Market Data Availability
- Polygon **free tier** only provides aggregate data for official market hours (9:30 AM - 4:00 PM ET)
- Pre-market quotes (4:00 AM - 9:30 AM) use *latest close* if no pre-market data available
- For true pre-market data, upgrade to Starter tier or use real-time quotes (premium)
- **Scanner Impact:** Pre-market scans may return yesterday's close prices; note in UI

### Common API Errors
```javascript
// 401 Unauthorized
// Cause: Invalid or missing API key
// Fix: Regenerate key at polygon.io dashboard, paste new key

// 429 Too Many Requests
// Cause: Rate limit exceeded (5 calls/min on free tier)
// Fix: Add delays between requests; reduce stock universe size

// 404 Not Found
// Cause: Stock symbol doesn't exist or delisted
// Fix: Validate ticker symbols; remove from STOCK_UNIVERSE if persistent

// Network Timeout
// Cause: API server slow or connectivity issue
// Fix: Retry after 30 seconds; check Polygon.io status page
```

### Response Parsing in Scanner
- `fetchStockData()` extracts OHLCV for last 20 business days (4-week window)
- Calculates RSI using close prices
- Calculates VWAP using volume-weighted closes
- Returns formatted stockData object to `runScan()`
- Failed requests logged but don't crash scan (other stocks continue)

---

### Adding New Stocks
Edit STOCK_UNIVERSE array (line 511):
```javascript
const STOCK_UNIVERSE = [
  'AAPL', 'MSFT', // ... add your symbols here
  'NEW_SYMBOL'
];
```

### Adjusting Scan Criteria
Edit CONFIG object (line 502):
```javascript
const CONFIG = {
  marketCapMin: 5000000000,  // Lower threshold
  avgVolumeMin: 2000000,     // More lenient
  rsiMin: 45,                // Wider RSI range
  rsiMax: 75
};
```

### Changing Refresh Interval
In startAutoRefresh() (line 1011), replace 300000ms (5 min):
```javascript
autoRefreshInterval = setInterval(runScan, 300000); // Change here
```

### Color Scheme / UI Customization
Edit CSS (lines 1-500) - All colors use CSS variables and inline styles; no external stylesheets.

---

## Common Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS blocked errors | Opening HTML from file:// | Run via START_SCANNER_SERVER.bat or use Chrome extension |
| "API key invalid" | Wrong/expired key | Regenerate key at polygon.io dashboard |
| No results returned | Poor market conditions or strict criteria | Lower CONFIG thresholds or expand STOCK_UNIVERSE |
| Slow scanning | API rate limiting | Polygon free tier has ~5 calls/min; pre-market reduces requests |
| Data missing for some stocks | Polygon API gaps | Check polygon-api-tester.html for connectivity |
| "Unexpected token < in JSON" | Server not running or wrong URL | Ensure START_SCANNER_SERVER.bat is open; try localhost:8000 in browser first |
| Results show 0 stocks | Criteria too strict | Check CONFIG thresholds; temporarily lower rsiMax or marketCapMin |
| Browser freezes during scan | API timeout or too many stocks | Reduce STOCK_UNIVERSE size; add delay between requests (see Rate Limiting section) |
| API key keeps being forgotten | localStorage issues | Check DevTools → Application → localStorage; browser may have private mode |
| "Cannot read property 'marketCap' of undefined" | Stock fetch failed silently | Check Network tab for failed requests; use polygon-api-tester.html to debug |
| Auto-refresh stops after few minutes | Interval accumulation or API errors | Check console for JS errors; hard refresh (Ctrl+Shift+R) and toggle auto-refresh off/on |
| Export CSV shows wrong data | Timestamp mismatch or format issue | Check calculateVWAP() and formatters; export only runs after successful scan |
| Different results on pre-market vs regular | Market hours detection | Verify ET timezone; some stocks unavailable pre-market on Polygon free tier |

---

## Code Structure Summary
```
aplus-polygon-scanner.html
├── HTML (lines 1-501)
│   ├── Header, controls, results table
│   └── Status display, auto-refresh toggle
├── CSS (embedded, lines 9-500)
│   └── Gradient backgrounds, responsive layout, dark theme
└── JavaScript (lines 502-967)
    ├── CONFIG & STOCK_UNIVERSE (data)
    ├── DOM element references (UI coupling)
    ├── Market hours checks (time logic)
    ├── Technical indicators: RSI, VWAP, formatters
    ├── fetchStockData() → Polygon API calls
    ├── meetsAPlusCriteria() → Filtering logic
    ├── runScan() → Orchestrator
    ├── displayResults() → UI updates
    ├── exportToTradeZella() → CSV export
    └── Event listeners (API key, buttons, toggles)
```

---

## AI Agent Quick Reference Checklist

When starting work on this codebase, reference these key points:

### Pre-Modification Checklist
- [ ] Scanner runs locally? Verify: `python -m http.server 8000` works
- [ ] API key valid? Test with polygon-api-tester.html
- [ ] Config thresholds clear? Review CONFIG object (line 502)
- [ ] Stock universe updated? Check STOCK_UNIVERSE array (line 511)
- [ ] Rate limits understood? Free tier = 5 calls/min; add delays between fetches

### Common Modifications & Risks
| Change | Impact | Caution |
|--------|--------|---------|
| Expand STOCK_UNIVERSE | Scan time increases exponentially | Free tier will rate-limit; add delays |
| Lower CONFIG thresholds | More results but noisier signals | Test with small universe first |
| Change time intervals | Market hours detection may break | Verify isMarketHours() and isPreMarket() logic |
| Modify CSV export | Results may not import to trading platform | Test import in TradeZella before deploying |
| Add new indicators | Code complexity increases | RSI/VWAP already calculated; reuse existing data |
| Change port number | Server won't start from .bat file | Update START_SCANNER_SERVER.bat AND file instructions |

### Testing Workflow
1. **Local changes:** Edit HTML → Refresh browser → Test feature
2. **API-dependent:** Use polygon-api-tester.html to debug requests
3. **Market hours:** Test both pre-market and regular hours modes
4. **Export:** Verify CSV opens in Excel/TradeZella correctly
5. **Rate limiting:** Monitor Network tab for 429 responses; add delays if needed

### Documentation Maintenance
- Update line numbers in this file if HTML structure changes significantly
- Comment new functions with purpose + return value format
- Note breaking changes to CONFIG object (backward compatibility)
- Record any Polygon API version changes or endpoint updates

---

## Author
ChartScript AI LLC | Rev. Barry Cannon, MSN, RN, PMP, ITIL v4

