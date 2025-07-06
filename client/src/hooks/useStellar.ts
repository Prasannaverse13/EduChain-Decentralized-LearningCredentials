import { useState, useCallback } from 'react';
import * as StellarSdk from 'stellar-sdk';
import useWallet from './useWallet';

export default function useStellar() {
  const { walletType, walletAddress, isConnected, getWalletInstance } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up the Stellar testnet server
  const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
  const networkPassphrase = StellarSdk.Networks.TESTNET;

  // Issue a new credential as a token on Stellar
  const issueCredential = useCallback(async (
    recipientAddress: string,
    credentialData: any
  ) => {
    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const wallet = getWalletInstance();
      if (!wallet) {
        throw new Error('Wallet instance not available');
      }

      // Load account
      const sourceAccount = await server.loadAccount(walletAddress);

      // Create a unique asset code for the credential
      const assetCode = `EDU${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const asset = new StellarSdk.Asset(assetCode, walletAddress);

      // Create the transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(StellarSdk.Operation.changeTrust({
          asset,
          source: recipientAddress,
        }))
        .addOperation(StellarSdk.Operation.payment({
          destination: recipientAddress,
          asset,
          amount: '1',
          source: walletAddress,
        }))
        // Add the credential data as a memo
        .addMemo(StellarSdk.Memo.text(JSON.stringify(credentialData).substring(0, 28)))
        .setTimeout(30)
        .build();

      // Sign and submit the transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const result = await server.submitTransaction(signedTransaction);

      setIsProcessing(false);
      return result.hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to issue credential';
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  }, [isConnected, walletAddress, getWalletInstance]);

  // Verify a credential by transaction hash
  const verifyCredential = useCallback(async (txHash: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const tx = await server.transactions().transaction(txHash).call();
      
      if (!tx.memo) {
        throw new Error('No credential data found in this transaction');
      }
      
      let credentialData;
      try {
        credentialData = JSON.parse(tx.memo);
      } catch (e) {
        // If parsing fails, return the memo text as is
        credentialData = tx.memo;
      }
      
      setIsProcessing(false);
      return {
        ...tx,
        credentialData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify credential';
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  }, []);

  // Get account information
  const getAccountInfo = useCallback(async (address: string = walletAddress) => {
    if (!address) {
      setError('Address not provided');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const account = await server.loadAccount(address);
      setIsProcessing(false);
      return account;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get account info';
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  }, [walletAddress]);

  return {
    issueCredential,
    verifyCredential,
    getAccountInfo,
    isProcessing,
    error,
    walletAddress,
    isConnected
  };
}
