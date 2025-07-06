import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlendIntegration from '@/components/BlendIntegration';

interface BlendFinanceProps {
  isWalletConnected: boolean;
  walletAddress: string;
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
  disconnectWallet: () => void;
}

export default function BlendFinance({ 
  isWalletConnected, 
  walletAddress, 
  connectWallet, 
  disconnectWallet 
}: BlendFinanceProps) {
  // Mock user credentials for demonstration
  // In production, this would come from the actual user's credential data
  const mockCredentials = isWalletConnected ? [
    {
      id: 1,
      title: "Blockchain Fundamentals Certificate",
      institution: "EduChain Academy",
      stellarTxHash: "mock_tx_hash_001",
      skills: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
      issuedAt: "2024-12-01"
    },
    {
      id: 2,
      title: "Advanced DeFi Protocol Certificate",
      institution: "MIT OpenCourseWare",
      stellarTxHash: "mock_tx_hash_002", 
      skills: ["DeFi", "Lending Protocols", "Yield Farming", "Liquidity Mining"],
      issuedAt: "2024-11-15"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">Educational Finance with Blend Protocol</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Access decentralized educational funding using your credentials as collateral. 
            Powered by Blend Protocol on Stellar blockchain.
          </p>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">About Blend Protocol Integration</h2>
            <p className="text-sm text-muted-foreground">
              EduChain has integrated with Blend Protocol, a leading DeFi lending platform on Stellar, 
              to offer students access to educational loans using their verified credentials as collateral. 
              This innovative approach democratizes access to education funding while maintaining the 
              security and transparency of blockchain technology.
            </p>
          </div>
        </div>

        <BlendIntegration
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          userCredentials={mockCredentials}
        />
      </main>
      
      <Footer />
    </div>
  );
}