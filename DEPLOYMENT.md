# Deployment Guide - A+ Scanner Pro v2.0

Complete deployment guide for the modernized React + Supabase application.

## ✅ Pre-Deployment Checklist

- [x] Supabase database configured with all tables
- [x] Edge function deployed (`scan-stocks`)
- [x] Environment variables configured
- [x] Build tested and passing
- [x] Authentication working
- [ ] Custom domain ready (optional)
- [ ] Payment integration configured (optional)

## 🚀 Quick Start Deployment

### Option 1: GitHub + Netlify (Recommended)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - A+ Scanner Pro v2.0"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**Step 2: Connect to Netlify**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your repository
5. Netlify auto-detects settings from `netlify.toml`
6. Click "Deploy site"

**Step 3: Environment Variables**
- Already configured in `.env`
- No additional configuration needed!

**Step 4: Live!**
- Your site is now live at `https://YOUR_SITE.netlify.app`
- Every push to main auto-deploys

### Option 2: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Drag & Drop

```bash
# Build locally
npm run build

# Drag 'dist' folder to: https://app.netlify.com/drop
```

## 🌐 Custom Domain

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL auto-configured

## 🔐 Supabase Configuration

### Auth Settings
Go to Supabase Dashboard → Authentication → Settings:

```
Site URL: https://YOUR_DOMAIN.com
Redirect URLs:
  - https://YOUR_DOMAIN.com/**
  - http://localhost:5173/**

Email Confirmation: Disabled (for faster onboarding)
```

## 💳 Payment Integration (Optional)

### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create products:
   - Monthly: $29/month
   - Yearly: $299/year
3. Generate Payment Links
4. Update upgrade buttons in:
   - `src/pages/Dashboard.tsx`
   - `src/pages/Settings.tsx`

## 🐛 Troubleshooting

**Build Fails**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**404 on Refresh**
- Already fixed via `netlify.toml` redirects

**Auth Issues**
- Check Supabase environment variables
- Verify Site URL matches your domain

**Scanner No Results**
- User must add Polygon.io API key in Settings
- Check Edge Function logs in Supabase

## ✅ Post-Deployment Checklist

- [ ] Site loads at production URL
- [ ] HTTPS working
- [ ] User registration works
- [ ] Login/logout works
- [ ] Scanner returns results
- [ ] Scan history saves
- [ ] Watchlist functions
- [ ] Settings save properly
- [ ] Mobile responsive

## 🎉 You're Live!

Your A+ Scanner Pro v2.0 is now deployed with:
- User authentication
- Database persistence
- Real-time stock scanning
- Freemium monetization ready

**Questions?** See README.md for full documentation.
