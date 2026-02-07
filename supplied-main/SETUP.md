# 🚀 Quick Setup & Deployment Guide

## Prerequisites

Before you begin, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/))
- A **MetaMask** browser extension ([Install here](https://metamask.io/))
- A **Vercel** account (free) ([Sign up here](https://vercel.com/))

---

## 📦 Step 1: Extract and Setup Project

1. **Extract the zip file** to your desired location
2. **Open terminal/command prompt** in the project folder
3. **Install dependencies:**
   ```bash
   npm install
   ```

---

## ⚙️ Step 2: Configure Environment

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your settings:
   - For testing, you can use the default Sepolia testnet settings
   - Update `VITE_APP_URL` later after deployment

---

## 🧪 Step 3: Test Locally

Run the development server:
```bash
npm run dev
```

Open your browser to `http://localhost:5173`

**Try the demo:**
- Click "Load Demo Batch" on any dashboard
- Test QR scanning, batch creation, etc.

---

## 🌐 Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Answer the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press Enter or type custom name
   - Directory? Press Enter (current directory)
   - Override settings? **N**

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

5. **Set environment variables:**
   ```bash
   vercel env add VITE_CHAIN_ID
   vercel env add VITE_CHAIN_NAME
   vercel env add VITE_RPC_URL
   vercel env add VITE_APP_URL
   ```

### Option B: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Framework preset: Vite
   - Click "Deploy"

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add each variable from `.env.example`

---

## 🔗 Step 5: Update App URL

After deployment, Vercel gives you a URL (e.g., `https://your-app.vercel.app`)

1. **Update `.env`:**
   ```env
   VITE_APP_URL=https://your-app.vercel.app
   ```

2. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🎯 Step 6: Connect Real Blockchain (Optional)

Currently, the app uses **mock data** for testing. To connect to a real smart contract:

### A. Deploy Smart Contract

1. Deploy your Solidity contract to Sepolia testnet
2. Get the contract address
3. Copy the contract ABI JSON

### B. Update Services

1. **Add Contract ABI:**
   - Create `src/services/SupplyChainABI.json`
   - Paste your contract ABI

2. **Update `.env`:**
   ```env
   VITE_CONTRACT_ADDRESS=0xYourContractAddress
   ```

3. **Replace Mock Service:**
   - Update `src/services/mockContract.js` with real ethers.js calls
   - See `CONTRACT_INTEGRATION.md` for detailed code examples

---

## 📱 Using the App

### For Manufacturers:
1. Connect MetaMask wallet
2. Select "Manufacturer" role
3. Create batches and generate QR codes
4. Print/attach QR codes to products

### For Distributors/Retailers:
1. Connect wallet
2. Select your role
3. Scan QR codes to transfer/receive batches

### For Consumers:
1. No wallet needed
2. Scan product QR code
3. View complete supply chain history

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### MetaMask not detected
- Install MetaMask extension
- Refresh browser page
- Check console for errors

### QR scanner not working
- Must use HTTPS (Vercel provides this)
- Grant camera permissions
- Try file upload mode

---

## 📂 Project Structure

```
supply-chain-tracker/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route pages/dashboards
│   ├── services/       # Blockchain & API services
│   ├── utils/          # Helper functions
│   ├── context/        # Global state management
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── .env.example        # Environment template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── vercel.json         # Vercel deployment config
```

---

## 🔑 Key Files to Know

- **`.env`** - Environment variables (never commit this!)
- **`src/services/mockContract.js`** - Mock blockchain interactions
- **`src/services/mockAPI.js`** - Mock API calls
- **`src/context/AppContext.jsx`** - Global state
- **`src/utils/constants.js`** - Configuration constants

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#0891b2',  // Change this
  // ...
}
```

### Change Network
Edit `src/utils/constants.js`:
```javascript
export const CHAIN_CONFIG = {
  chainId: '11155111',  // Change to your network
  chainName: 'Sepolia',
  rpcUrl: 'YOUR_RPC_URL',
};
```

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `CONTRACT_INTEGRATION.md` for blockchain integration
- See `DEPLOYMENT.md` for advanced deployment options
- Check GitHub Issues or create a new one

---

## 🎉 You're All Set!

Your supply chain tracker is now live! Share the URL with your team and start tracking products.

**Next Steps:**
- Test all user flows
- Add your branding
- Connect real smart contract
- Add backend API for data persistence
