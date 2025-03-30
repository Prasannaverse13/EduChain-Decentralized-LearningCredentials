import { useState, useEffect, useCallback } from 'react';
import { FreighterWallet, MetaMaskWallet } from '@/lib/wallet';

type WalletType = 'metamask' | 'freighter' | '';

export default function useWallet() {
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet instances
  const freighterWallet = new FreighterWallet();
  const metamaskWallet = new MetaMaskWallet();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        // First check localStorage for saved wallet info
        const savedWalletType = localStorage.getItem('walletType') as WalletType;
        const savedWalletAddress = localStorage.getItem('walletAddress');
        
        if (savedWalletType && savedWalletAddress) {
          // Verify that wallet is still connected
          if (savedWalletType === 'freighter' && window.freighter && await window.freighter.isConnected()) {
            const publicKey = await window.freighter.getPublicKey();
            if (publicKey && publicKey === savedWalletAddress) {
              setWalletType('freighter');
              setWalletAddress(publicKey);
              setIsConnected(true);
              return;
            }
          } else if (savedWalletType === 'metamask' && window.ethereum) {
            try {
              const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
              });
              if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedWalletAddress.toLowerCase()) {
                setWalletType('metamask');
                setWalletAddress(accounts[0]);
                setIsConnected(true);
                return;
              }
            } catch (err) {
              console.log("MetaMask verification failed:", err);
            }
          }
        }
        
        // If no valid saved wallet, check each wallet type
        // Check for Freighter first
        if (window.freighter && await window.freighter.isConnected()) {
          const publicKey = await window.freighter.getPublicKey();
          if (publicKey) {
            setWalletType('freighter');
            setWalletAddress(publicKey);
            setIsConnected(true);
            // Save to localStorage
            localStorage.setItem('walletType', 'freighter');
            localStorage.setItem('walletAddress', publicKey);
            return;
          }
        }
        
        // Then check for MetaMask
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ 
              method: 'eth_accounts' 
            });
            if (accounts && accounts.length > 0) {
              setWalletType('metamask');
              setWalletAddress(accounts[0]);
              setIsConnected(true);
              // Save to localStorage
              localStorage.setItem('walletType', 'metamask');
              localStorage.setItem('walletAddress', accounts[0]);
              return;
            }
          } catch (err) {
            console.log("MetaMask not connected:", err);
          }
        }
      } catch (err) {
        console.log("Error checking existing connections:", err);
      }
    };
    
    checkExistingConnection();
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async (type: WalletType) => {
    if (!type) {
      setError('Wallet type not specified');
      return false;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if wallet extension is available
      if (type === 'freighter' && !window.freighter) {
        throw new Error('Freighter wallet extension is not installed. Please install it from the Chrome Web Store.');
      }
      
      if (type === 'metamask' && !window.ethereum) {
        throw new Error('MetaMask wallet extension is not installed. Please install it from the Chrome Web Store.');
      }
      
      let address: string;
      
      if (type === 'freighter') {
        address = await freighterWallet.connect();
      } else if (type === 'metamask') {
        address = await metamaskWallet.connect();
      } else {
        throw new Error('Invalid wallet type');
      }
      
      // No mock addresses - we need real wallet connections
      if (!address) {
        throw new Error(`Failed to connect ${type} wallet. Please make sure you have the browser extension installed and granted permission.`);
      }
      
      setWalletType(type);
      setWalletAddress(address);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Save to localStorage
      localStorage.setItem('walletType', type);
      localStorage.setItem('walletAddress', address);
      
      console.log(`Successfully connected ${type} wallet: ${address}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      console.error('Wallet connection error:', errorMessage);
      setError(errorMessage);
      setIsConnecting(false);
      return false;
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    if (walletType === 'freighter') {
      freighterWallet.disconnect();
    } else if (walletType === 'metamask') {
      metamaskWallet.disconnect();
    }
    
    // Clear state
    setWalletType('');
    setWalletAddress('');
    setIsConnected(false);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
    
    console.log('Wallet disconnected');
  }, [walletType]);

  // Get wallet instance for transactions
  const getWalletInstance = useCallback(() => {
    if (!isConnected) return null;
    return walletType === 'freighter' ? freighterWallet : metamaskWallet;
  }, [walletType, isConnected]);

  return {
    walletType,
    walletAddress,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    getWalletInstance
  };
}
