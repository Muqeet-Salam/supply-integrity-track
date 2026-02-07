# Supply Chain Integrity Tracker - Frontend

A blockchain-powered supply chain tracking application built with React, enabling transparent product verification from manufacturer to consumer.

## 🎯 Features

- **Multi-Role Dashboard System**
  - Manufacturer: Create batches, generate QR codes
  - Distributor: Transfer custody, maintain chain
  - Retailer: Confirm receipt, prepare for sale
  - Consumer: Verify authenticity, view provenance

- **Blockchain Integration**
  - MetaMask wallet connection
  - Smart contract interactions (currently mocked, ready for real deployment)
  - Immutable batch tracking

- **QR Code System**
  - Dynamic QR generation with decode animation
  - Camera & file upload scanning
  - Deep linking support

- **Integrity Verification**
  - Real-time integrity scoring
  - Anomaly detection alerts
  - Complete supply chain timeline

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.4
- **Blockchain**: Ethers.js v6
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **QR Codes**: qrcode.react, html5-qrcode
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask browser extension

### Setup Steps

1. **Clone and Install**
   ```bash
   cd supply-chain-frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Blockchain Configuration
   VITE_CHAIN_ID=11155111
   VITE_CHAIN_NAME=Sepolia
   VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

   # Smart Contract (add after deployment)
   VITE_CONTRACT_ADDRESS=

   # Backend API
   VITE_API_BASE_URL=http://localhost:5000/api

   # App URL
   VITE_APP_URL=https://yourapp.vercel.app

  # Enable real backend integration
  # Set to 'true' to make the frontend call the backend API at VITE_API_BASE_URL
  VITE_USE_REAL_API=false
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   App will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.example`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Alternative: Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🔗 Integrating Real Smart Contract

The app currently uses mock services. To connect to your deployed smart contract:

### 1. Update Contract Service

Replace `/src/services/mockContract.js` with real contract integration:

```javascript
import { ethers } from 'ethers';
import contractABI from './SupplyChainABI.json';

class ContractService {
  async initialize(provider, signer) {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    this.contract = new ethers.Contract(contractAddress, contractABI, signer);
    return true;
  }

  async createBatch(productName, batchSize, location) {
    const tx = await this.contract.createBatch(productName, batchSize, location);
    const receipt = await tx.wait();
    const batchId = receipt.events[0].args.batchId;
    return { batchId, txHash: receipt.transactionHash };
  }

  // ... implement other methods
}
```

### 2. Add Contract ABI

1. After deploying your Solidity contract, copy the ABI
2. Create `/src/services/SupplyChainABI.json` with your contract ABI
3. Update `.env` with your contract address

### 3. Update API Service

Replace `/src/services/mockAPI.js` with real axios calls:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getBatchHistory = async (batchId) => {
  const { data } = await api.get(`/batch/${batchId}/history`);
  return data;
};
```

## 📱 User Flows

### Manufacturer Flow
1. Connect wallet → Select "Manufacturer" role
2. Fill batch creation form (product name, size, location)
3. Submit transaction → Wait for confirmation
4. Download/print generated QR code
5. Attach QR to product packaging

### Distributor Flow
1. Connect wallet → Select "Distributor" role
2. Scan batch QR code
3. Review batch details and history
4. Enter next handler address and location
5. Submit transfer transaction

### Retailer Flow
1. Connect wallet → Select "Retailer" role
2. Scan batch QR code
3. Review complete supply chain journey
4. Confirm receipt at retail location
5. Mark batch as ready for sale

### Consumer Flow
1. Open app (no wallet needed)
2. Scan product QR code or enter batch ID
3. View product journey timeline
4. Check integrity score and alerts
5. Verify authenticity

## 🎨 Design System

### Color Palette
```javascript
Primary (Cyber): #0891b2
Background: #0a0e27
Cards: rgba(15, 23, 42, 0.6)
Success: #10b981
Warning: #f59e0b
Danger: #ef4444
```

### Typography
- **Display**: Orbitron (headers, titles)
- **Mono**: JetBrains Mono (addresses, IDs)
- **Body**: Inter (general text)

### Components
All components are in `/src/components/`:
- `WalletConnect.jsx` - MetaMask connection
- `QRDecodeAnimation.jsx` - Animated QR reveal
- `QRScanner.jsx` - Camera/upload scanner
- `Timeline.jsx` - Supply chain history
- `IntegrityBadge.jsx` - Status indicator
- `AlertBanner.jsx` - Warning messages
- `LoadingSpinner.jsx` - Loading states

## 🧪 Testing

### Demo Mode
Click "Load Demo Batch" on any dashboard to test with pre-populated data.

Demo Batch ID: `BATCH-2026-001-DEMO`

### Manual Testing Checklist
- [ ] Wallet connection/disconnection
- [ ] Role selection
- [ ] Batch creation (Manufacturer)
- [ ] QR code generation and download
- [ ] QR code scanning (camera & upload)
- [ ] Batch transfer (Distributor)
- [ ] Receipt confirmation (Retailer)
- [ ] Consumer verification
- [ ] Timeline display
- [ ] Integrity score display
- [ ] Alert notifications

## 📂 Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── context/         # React context (global state)
├── pages/           # Route pages
├── services/        # Contract & API services
├── utils/           # Helper functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🔧 Configuration

### Network Configuration
Edit `/src/utils/constants.js` to change blockchain network:

```javascript
export const CHAIN_CONFIG = {
  chainId: '11155111', // Sepolia
  chainName: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
};
```

### QR Code Settings
```javascript
export const QR_CODE_SIZE = 256;  // Pixel size
export const QR_CODE_LEVEL = 'H'; // Error correction level
```

## 🐛 Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed
- Refresh the page after installation
- Check browser console for errors

### Contract Call Fails
- Verify wallet is connected to correct network
- Check contract address in `.env`
- Ensure you have test ETH for gas fees

### QR Scanner Not Working
- Grant camera permissions when prompted
- Use HTTPS (required for camera access)
- Try file upload mode as fallback

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: [Wiki]

---

Built with ❤️ for transparent supply chains
