import { ethers } from 'ethers';
import { CHAIN_CONFIG } from '../utils/constants';

/**
 * Wallet Service
 * Handles MetaMask connection and wallet operations
 */

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask
   */
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.address = await this.signer.getAddress();

      // Check network
      const network = await this.provider.getNetwork();
      const currentChainId = network.chainId.toString();

      // Switch network if needed
      if (currentChainId !== CHAIN_CONFIG.chainId) {
        await this.switchNetwork();
      }

      return {
        address: this.address,
        provider: this.provider,
        signer: this.signer,
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Switch to correct network
   */
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(CHAIN_CONFIG.chainId).toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await this.addNetwork();
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Add network to MetaMask
   */
  async addNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${parseInt(CHAIN_CONFIG.chainId).toString(16)}`,
            chainName: CHAIN_CONFIG.chainName,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [CHAIN_CONFIG.rpcUrl],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } catch (error) {
      console.error('Failed to add network:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  /**
   * Get current address
   */
  getAddress() {
    return this.address;
  }

  /**
   * Get provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Get signer
   */
  getSigner() {
    return this.signer;
  }

  /**
   * Get balance
   */
  async getBalance() {
    if (!this.provider || !this.address) return '0';
    
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  /**
   * Listen for account changes
   */
  onAccountsChanged(callback) {
    if (!this.isMetaMaskInstalled()) return;
    
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
        callback(null);
      } else {
        this.address = accounts[0];
        callback(accounts[0]);
      }
    });
  }

  /**
   * Listen for chain changes
   */
  onChainChanged(callback) {
    if (!this.isMetaMaskInstalled()) return;
    
    window.ethereum.on('chainChanged', (chainId) => {
      callback(chainId);
      // Reload page on chain change (recommended by MetaMask)
      window.location.reload();
    });
  }

  /**
   * Sign message
   */
  async signMessage(message) {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.signMessage(message);
  }
}

// Export singleton instance
export const walletService = new WalletService();
