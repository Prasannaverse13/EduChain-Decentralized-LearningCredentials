import * as StellarSdk from 'stellar-sdk';

interface WalletProvider {
  connect(): Promise<string>;
  disconnect(): void;
  signTransaction(transaction: any): Promise<any>;
  isConnected(): boolean;
  getPublicKey(): string | null;
}

// Freighter wallet integration
export class FreighterWallet implements WalletProvider {
  private publicKey: string | null = null;
  
  async connect(): Promise<string> {
    try {
      // Check if Freighter is installed
      if (!window.freighter) {
        throw new Error('Freighter wallet is not installed. Please install the browser extension.');
      }
      
      // Check if user has already given permission
      const connected = await window.freighter.isConnected();
      if (!connected) {
        await window.freighter.connect();
      }
      
      this.publicKey = await window.freighter.getPublicKey();
      
      if (!this.publicKey) {
        throw new Error('Failed to get public key from Freighter');
      }
      
      return this.publicKey;
    } catch (error) {
      console.error('Freighter connection error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to connect to Freighter');
    }
  }
  
  disconnect(): void {
    this.publicKey = null;
  }
  
  async signTransaction(transaction: StellarSdk.Transaction): Promise<StellarSdk.Transaction> {
    if (!this.publicKey) {
      throw new Error('Wallet not connected');
    }
    
    if (!window.freighter) {
      throw new Error('Freighter wallet extension not detected');
    }
    
    try {
      // Using non-null assertion as we checked window.freighter above
      const signedXDR = await window.freighter!.signTransaction(
        transaction.toXDR(),
        { networkPassphrase: StellarSdk.Networks.TESTNET }
      );
      
      // Type assertion to handle the returned transaction correctly
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        StellarSdk.Networks.TESTNET
      ) as StellarSdk.Transaction;
      
      return signedTransaction;
    } catch (error) {
      console.error('Transaction signing error:', error);
      throw new Error('Failed to sign transaction with Freighter');
    }
  }
  
  isConnected(): boolean {
    return this.publicKey !== null;
  }
  
  getPublicKey(): string | null {
    return this.publicKey;
  }
}

// MetaMask wallet integration
export class MetaMaskWallet implements WalletProvider {
  private address: string | null = null;
  
  async connect(): Promise<string> {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install the browser extension.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.address = accounts[0];
      
      if (!this.address) {
        throw new Error('Failed to get address from MetaMask');
      }
      
      return this.address;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to connect to MetaMask');
    }
  }
  
  disconnect(): void {
    this.address = null;
  }
  
  async signTransaction(transaction: any): Promise<any> {
    if (!this.address) {
      throw new Error('Wallet not connected');
    }
    
    if (!window.ethereum) {
      throw new Error('MetaMask extension not detected');
    }
    
    try {
      // For MetaMask, we would normally use eth_signTransaction
      // But for integration with Stellar, we'd need additional steps
      // This is a simplified example
      // Using non-null assertion as we checked window.ethereum above
      const signature = await window.ethereum!.request({
        method: 'eth_signTypedData_v4',
        params: [this.address, JSON.stringify(transaction)],
      });
      
      return {
        transaction,
        signature
      };
    } catch (error) {
      console.error('Transaction signing error:', error);
      throw new Error('Failed to sign transaction with MetaMask');
    }
  }
  
  isConnected(): boolean {
    return this.address !== null;
  }
  
  getPublicKey(): string | null {
    return this.address;
  }
}

// Declare global window interface for wallet extensions
declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>;
      connect: () => Promise<void>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, options: any) => Promise<string>;
    };
    ethereum?: {
      isMetaMask?: boolean;
      isConnected?: () => boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}
