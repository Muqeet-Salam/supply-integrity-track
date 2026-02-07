# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd supply-chain-frontend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? supply-chain-tracker (or your choice)
   - Directory? ./ (current directory)
   - Override build settings? No

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_CHAIN_ID
   vercel env add VITE_CHAIN_NAME
   vercel env add VITE_RPC_URL
   vercel env add VITE_API_BASE_URL
   vercel env add VITE_APP_URL
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables in Vercel dashboard
7. Click "Deploy"

## Environment Variables for Production

Add these in Vercel dashboard (Settings → Environment Variables):

```
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_URL=https://your-vercel-app.vercel.app
```

## Post-Deployment Checklist

- [ ] Update VITE_APP_URL with your Vercel URL
- [ ] Test wallet connection
- [ ] Test QR code scanning (requires HTTPS)
- [ ] Verify all role dashboards work
- [ ] Check mobile responsiveness
- [ ] Test demo mode
- [ ] Update smart contract address when deployed
- [ ] Configure backend API URL

## Alternative: Netlify

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag & drop `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add all VITE_* variables

## Domain Configuration

### Custom Domain on Vercel

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Update Environment Variables

After setting custom domain, update:
```
VITE_APP_URL=https://your-custom-domain.com
```

## Monitoring & Analytics

### Vercel Analytics (Optional)

1. Go to project → Analytics
2. Enable Web Analytics
3. No code changes needed

### Error Tracking (Optional)

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

## Performance Optimization

Already implemented:
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized images
- ✅ Minified production build
- ✅ Tree shaking

## Security Best Practices

- ✅ No hardcoded secrets
- ✅ Environment variables for config
- ✅ HTTPS enforced
- ✅ Content Security Policy headers (configure in vercel.json)

## Continuous Deployment

Set up automatic deployments:
1. Connect GitHub repository to Vercel
2. Every push to `main` branch auto-deploys to production
3. Pull requests get preview deployments

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies installed
- Review build logs in Vercel

### Environment Variables Not Working
- Ensure all variables start with `VITE_`
- Rebuild after adding variables
- Clear build cache if needed

### QR Scanner Not Working
- QR scanner requires HTTPS (Vercel provides this automatically)
- Check camera permissions in browser

## Rollback

If deployment has issues:
```bash
vercel rollback
```

Or use Vercel dashboard:
- Deployments → Select previous deployment → Promote to Production
