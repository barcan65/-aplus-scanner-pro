# Netlify Deployment Guide - 3 Easy Steps

## Step 1: Prepare Files
You have everything ready:
- ✅ `aplus-polygon-scanner.html` (main app)
- ✅ `netlify.toml` (configuration)
- ✅ `README.md` (documentation)

## Step 2: Deploy (Choose One Method)

### METHOD A: Drag & Drop (Fastest - 1 minute)
1. Go to **app.netlify.com/drop**
2. Drag the folder `C:\Trading\Scanners` into the browser
3. Wait for upload to complete
4. Done! You'll get a live URL instantly

### METHOD B: Git Integration (Best - Automatic Updates)
1. Create GitHub account at github.com (free)
2. Create new repository called `aplus-scanner`
3. Push these 3 files to the repo:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aplus-scanner.git
   git push -u origin main
   ```
4. Go to **app.netlify.com**
5. Click "New site from Git"
6. Connect your GitHub repo
7. Netlify auto-deploys on every push

### METHOD C: Netlify CLI (For Developers)
```bash
npm install -g netlify-cli
cd C:\Trading\Scanners
netlify deploy --prod
```

## Step 3: Verify & Customize

### After Deploy:
1. ✅ Test the app at your new URL
2. ✅ Enter a test Polygon.io API key
3. ✅ Run a scan to verify it works
4. ✅ Click "Upgrade to Pro" and verify the pricing modal appears

### Customize Your Domain:
1. In Netlify dashboard, click "Domain settings"
2. Add custom domain (requires DNS setup)
   - Free: `aplus-scanner.netlify.app` (auto)
   - Custom: `scanner.yourdomain.com` (paid domain)

### Add Analytics (Optional):
1. In Netlify dashboard: Analytics → Enable
2. Track visitors, conversions, etc.

## Your Deployment Info

**After deploying, you'll get:**
- 🌐 Live URL: `https://your-site.netlify.app`
- 🔒 SSL/HTTPS: Automatic (free)
- ⚡ CDN: Automatic (fast worldwide)
- 📊 Analytics: Optional (free)

## Payment Processing (Next Phase)

To accept payments, you need:
1. **Stripe** (recommended)
   - Sign up at stripe.com
   - Get publishable key & price ID
   - Update `initializePayment()` function

2. **Alternative**: Paddle, Gumroad, or Lemonsqueezy

## Troubleshooting

**White screen?**
- Check browser console (F12)
- Verify netlify.toml is present
- Hard refresh (Ctrl+Shift+R)

**API not working?**
- Polygon.io API key must be valid
- Check subscription status at polygon.io/dashboard
- See console errors (F12)

**Custom domain not working?**
- Update DNS records as shown in Netlify
- Can take 24-48 hours to propagate

---

**Ready to go live?** Choose METHOD A (Drag & Drop) - it's the fastest!

