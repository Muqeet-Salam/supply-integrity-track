# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### 1. Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- Terminal/Command Prompt

### 2. Installation

```bash
# Navigate to project folder
cd supply-chain-frontend

# Install dependencies
npm install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

The app will work with default settings for testing!

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser 🎉

### 5. Test the App

1. **Connect Wallet**
   - Click "Connect Wallet" 
   - Approve MetaMask connection
   - Switch to Sepolia testnet if prompted

2. **Try Each Role**
   
   **Manufacturer:**
   - Select "Manufacturer" role
   - Fill in: Product name, batch size, location
   - Click "Create Batch"
   - Watch the cool QR decode animation! 🎬
   - Download the QR code

   **Consumer (No Wallet Needed):**
   - Go back to home
   - Click "Verify Product"
   - Click "Load Demo Batch"
   - See the complete supply chain journey
   - Check integrity score

   **Distributor:**
   - Select "Distributor" role
   - Click "Load Demo Batch"
   - Enter a test wallet address
   - Transfer the batch

   **Retailer:**
   - Select "Retailer" role
   - Click "Load Demo Batch"
   - Confirm receipt

## 🎨 Key Features to Show Off

### 1. QR Decode Animation
The QR code reveal animation is 🔥 - creates a matrix-style decoding effect before showing the QR code.

### 2. Timeline Visualization
Beautiful, animated timeline showing the complete product journey through the supply chain.

### 3. Integrity Scoring
Real-time integrity checks with visual badges and alerts.

### 4. QR Scanner
Works on both desktop (file upload) and mobile (camera).

## 📱 Mobile Testing

The app is fully responsive! To test on mobile:

1. **Local Network Testing:**
   ```bash
   # Find your local IP
   # On Mac/Linux: ifconfig | grep "inet "
   # On Windows: ipconfig
   
   # Access from mobile using your IP
   http://YOUR_LOCAL_IP:3000
   ```

2. **Or use ngrok:**
   ```bash
   npm install -g ngrok
   ngrok http 3000
   # Use the https URL on mobile
   ```

## 🎯 Demo Flow for Presentations

### Perfect Hackathon Demo (3 minutes):

1. **Intro (30 sec)**
   - "Supply chain tracking on blockchain with QR verification"
   - Show homepage

2. **Manufacturer Flow (1 min)**
   - Create a batch
   - Show QR code generation with animation
   - Explain blockchain registration

3. **Consumer Flow (1 min)**
   - Switch to consumer view (no wallet)
   - Scan/load demo batch
   - Show integrity score
   - Walk through timeline
   - Highlight transparency

4. **Tech Stack (30 sec)**
   - React + Blockchain
   - Real-time verification
   - Mobile-ready

## 🛠️ Customization Quick Tips

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'cyber': {
    500: '#YOUR_COLOR',
  }
}
```

### Change Fonts
Edit `index.html` - Google Fonts links
Update `tailwind.config.js` - fontFamily

### Add Your Logo
Replace in `HomePage.jsx`:
```jsx
<Shield className="text-cyber-500" size={32} />
```

## 🐛 Troubleshooting

### "MetaMask not detected"
- Install MetaMask extension
- Refresh page

### QR scanner not working
- Allow camera permissions
- Use file upload instead
- Ensure HTTPS (automatic on Vercel)

### Batch not found
- Use "Load Demo Batch" for testing
- Check wallet is connected for creating batches

## 📚 Next Steps

1. **Deploy to Vercel** - See DEPLOYMENT.md
2. **Connect Real Smart Contract** - See CONTRACT_INTEGRATION.md
3. **Add Backend API** - Update mockAPI.js
4. **Customize Design** - Tweak Tailwind config

## 💡 Pro Tips

- Demo mode works without wallet/blockchain
- All services are mocked - easy to replace later
- Code is heavily commented
- Mobile responsive by default
- Dark mode only (matches reference site)

## 🎉 You're Ready!

The app is production-ready with mock data. When your smart contract is deployed:
1. Add contract address to `.env`
2. Replace mockContract.js (guide in CONTRACT_INTEGRATION.md)
3. Deploy to Vercel

Questions? Check README.md for full documentation!
