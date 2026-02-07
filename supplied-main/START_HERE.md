# 🎯 Supply Chain Integrity Tracker

## Welcome! 👋

This is a **blockchain-powered supply chain tracking application** that enables transparent product verification from manufacturer to consumer.

---

## ⚡ Quick Start (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Run Locally
```bash
npm run dev
```

### 3️⃣ Open Browser
Visit: `http://localhost:5173`

### 4️⃣ Try Demo Mode
Click **"Load Demo Batch"** to test without blockchain setup!

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **SETUP.md** | Complete setup & deployment guide |
| **README.md** | Full technical documentation |
| **QUICKSTART.md** | 5-minute getting started guide |
| **DEPLOYMENT.md** | Advanced deployment options |
| **CONTRACT_INTEGRATION.md** | Blockchain integration guide |
| **PROJECT_OVERVIEW.md** | Architecture and design decisions |

---

## 🚀 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Your app will be live at: `https://your-app.vercel.app`

---

## ✨ Features

- ✅ **Multi-Role Dashboards** - Manufacturer, Distributor, Retailer, Consumer
- ✅ **QR Code System** - Generate and scan product QR codes
- ✅ **Blockchain Ready** - MetaMask integration (mock mode included)
- ✅ **Real-time Tracking** - Complete supply chain timeline
- ✅ **Integrity Scoring** - Anomaly detection and alerts
- ✅ **Mobile Responsive** - Works on all devices

---

## 🛠️ Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3.4
- Ethers.js v6 (blockchain)
- Framer Motion (animations)
- React Router v6
- QR Code libraries

---

## 🎭 User Flows

### Manufacturer
1. Connect wallet → Create batch → Generate QR code → Attach to product

### Distributor/Retailer
1. Connect wallet → Scan QR → Transfer/Receive batch

### Consumer
1. Scan QR code → View product journey → Verify authenticity

---

## 📦 What's Included?

```
supply-chain-tracker/
├── src/
│   ├── components/    # UI components (QR, Timeline, etc.)
│   ├── pages/        # Role dashboards
│   ├── services/     # Blockchain & API (currently mocked)
│   ├── utils/        # Helper functions
│   └── context/      # Global state
├── public/           # Static assets
├── docs/            # All documentation
└── Config files     # Vite, Tailwind, etc.
```

---

## 🔐 Environment Setup

1. Copy `.env.example` to `.env`
2. Add your configuration (optional for demo mode)
3. For production: Add real blockchain contract address

---

## 🧪 Demo Mode

The app works **out of the box** with mock data:
- No blockchain required
- No backend needed
- Perfect for testing UI/UX

Click "Load Demo Batch" on any dashboard!

---

## 🌐 Going Live

**Current State:** Mock blockchain (for testing)

**To connect real blockchain:**
1. Deploy smart contract to network (e.g., Sepolia)
2. Update `.env` with contract address
3. Replace mock services with real ethers.js calls
4. See `CONTRACT_INTEGRATION.md` for details

---

## 📱 Mobile App Ready

The UI is fully responsive and works on:
- Desktop browsers
- Mobile browsers (camera QR scanning)
- Tablets

---

## 🎨 Customization

### Change Branding
- Update colors in `tailwind.config.js`
- Replace logo/images in `public/`
- Edit text in components

### Change Network
- Update `src/utils/constants.js`
- Modify `.env` blockchain settings

---

## 🐛 Troubleshooting

**Install fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails?**
```bash
npm run build
```

**MetaMask issues?**
- Make sure MetaMask extension is installed
- Refresh page after installation

**Need help?** Check `SETUP.md` for detailed troubleshooting!

---

## 🤝 Next Steps

1. ✅ Run locally (`npm run dev`)
2. ✅ Test demo mode
3. ✅ Deploy to Vercel
4. ✅ Customize branding
5. ⏳ Connect real blockchain (optional)
6. ⏳ Add backend API (optional)

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 💡 Pro Tips

- Use **demo mode** to test all features without blockchain
- Deploy to **Vercel** for instant HTTPS (required for camera)
- Read **SETUP.md** for step-by-step deployment
- Check **CONTRACT_INTEGRATION.md** before connecting real blockchain

---

## 🎉 Ready to Go!

You have everything you need to:
1. Run the app locally
2. Deploy to production
3. Test all features
4. Connect real blockchain when ready

**Start here:** `npm install && npm run dev`

**Questions?** Read `SETUP.md` or `README.md`

---

Built with ❤️ for transparent supply chains
