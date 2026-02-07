import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { mockContract } from '../services/mockContract';
import { mockAPI } from '../services/mockAPI';
import { toast } from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const { address, provider, signer } = await walletService.connect();
      setWalletAddress(address);
      
      // Initialize mock contract
      await mockContract.initialize(provider, signer);
      setIsInitialized(true);
      
      toast.success('Wallet connected successfully!');
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    walletService.disconnect();
    mockAPI.clearToken();
    setWalletAddress(null);
    setUserRole(null);
    setIsInitialized(false);
    toast.success('Wallet disconnected');
  };

  // Set user role (after role selection)
  const selectRole = async (role) => {
    if (!walletAddress) {
      toast.error('Please connect wallet first');
      return;
    }
    
    try {
      // Mock login to get JWT
      await mockAPI.login(walletAddress, role);
      setUserRole(role);
      toast.success(`Role set to ${role}`);
    } catch (error) {
      console.error('Failed to set role:', error);
      toast.error('Failed to set role');
    }
  };

  // Listen for account changes
  useEffect(() => {
    walletService.onAccountsChanged((newAddress) => {
      if (!newAddress) {
        disconnectWallet();
      } else {
        setWalletAddress(newAddress);
        toast.info('Account changed');
      }
    });

    walletService.onChainChanged((chainId) => {
      console.log('Chain changed:', chainId);
    });
  }, []);

  const value = {
    walletAddress,
    userRole,
    isConnecting,
    isInitialized,
    connectWallet,
    disconnectWallet,
    selectRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
