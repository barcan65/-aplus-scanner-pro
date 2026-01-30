# A+ Scanner Pro - Polygon.io Edition

Professional stock screening tool with real-time data from Polygon.io. Includes freemium monetization model.

🌐 **[Live App: https://aplus-scanner-pro.netlify.app/](https://aplus-scanner-pro.netlify.app/)**

## Features

### 📊 Screening Capabilities
- **Real-time Data**: Pre-market & regular hours scanning
- **A+ Criteria**: Market Cap >$10B, Volume >5M, Price >VWAP, RSI 50-70
- **Float Analysis**: Categorizes stocks by float size (Nano/Low/Medium/High/Mega)
- **Technical Indicators**: RSI, VWAP, Gap analysis

### 🎯 Freemium Model

**FREE TIER**
- Up to 20 stocks per scan
- Manual scans only
- No export functionality
- Regular hours only

**PRO TIER ($29/month or $299/year)**
- ✓ All 100+ stocks in universe
- ✓ Export to CSV/TradeZella
- ✓ Auto-refresh every 5 minutes
- ✓ Advanced RSI/VWAP analysis
- ✓ Pre-market + Regular hours
- ✓ 7-day free trial

## Quick Start

### Local Development
```bash
python -m http.server 8000
# Visit: http://localhost:8000/aplus-polygon-scanner.html
```

### Netlify Deployment

1. **Sign up for free at netlify.com**

2. **Option A: Drag & Drop**
   - Go to app.netlify.com/drop
   - Drag the folder containing `aplus-polygon-scanner.html` and `netlify.toml`
   - Done! Your site is live

3. **Option B: Git Integration**
   - Push code to GitHub
   - Connect repo to Netlify
   - Auto-deploys on push

## Customization

### Change Pricing
Edit the modal in the HTML:
```javascript
// Line ~520
<div style="font-size: 2.5em;">
    $29<span style="font-size: 0.5em;">/month</span>
</div>
```

### Change Stock Limits
Edit CONFIG:
```javascript
// Line ~40
CONFIG.freeMaxStocks = 20;    // Change this
CONFIG.proMaxStocks = 100;     // Or this
```

### Polygon.io API Integration
1. Get free API key at polygon.io
2. Users enter their key in the app
3. No backend needed - secure client-side requests

## Monetization Setup

### Stripe Integration (Phase 2)
Replace the `initializePayment()` function with Stripe redirect:
```javascript
function initializePayment(plan) {
}
```
Alternatively, use Stripe Payment Links (no server-side code required):

- Create Payment Links in your Stripe Dashboard for monthly and yearly plans
- Set `PAYMENT_LINK_MONTHLY` and `PAYMENT_LINK_YEARLY` constants in `aplus-polygon-scanner.html`

Example (in `aplus-polygon-scanner.html`):
```javascript
const PAYMENT_LINK_MONTHLY = 'https://buy.stripe.com/test_xxx';
const PAYMENT_LINK_YEARLY = 'https://buy.stripe.com/test_yyy';
```

The app will open a Payment Link in a new tab; if no links are set, the app falls back to a 7-day demo trial.

### Email for Support
Update footer with your email:
```html
support@yourdomain.com
```

## Deployment Checklist

- [ ] Test app locally: `python -m http.server 8000`
- [ ] Update email address in modal
- [ ] Register domain name
- [ ] Create Netlify account
- [ ] Deploy via Netlify
- [ ] Add custom domain in Netlify settings
- [ ] Set up SSL (automatic on Netlify)
- [ ] Create payment processor account (Stripe/Paddle)
- [ ] Update `initializePayment()` with real payment handler
- [ ] Add privacy policy & terms of service
- [ ] Set up Google Analytics (optional)

## File Structure

```
aplus-polygon-scanner.html   # Main app (no backend needed)
netlify.toml                 # Netlify config
README.md                    # This file
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

## Performance

- **Zero backend**: Static HTML/CSS/JS
- **Fast load**: <100KB total
- **Real-time API**: Polygon.io handles data
- **Scalable**: No server costs

## Security Notes

- API keys stored in browser localStorage (user-controlled)
- No server-side storage of API keys
- HTTPS enforced by Netlify
- No user data collection (except payment for Pro)

## Support

For issues:
1. Check browser console (F12) for errors
2. Verify Polygon.io API key is valid
3. Ensure you're within market hours
4. Check Polygon.io subscription status

---

**Created by ChartScript AI LLC**  
Rev. Barry Cannon, MSN, RN, PMP, ITIL v4

