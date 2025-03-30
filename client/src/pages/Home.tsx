import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCourses from '@/components/FeaturedCourses';
import CredentialVerification from '@/components/CredentialVerification';
import WalletConnect from '@/components/WalletConnect';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HomeProps {
  isWalletConnected: boolean;
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
  walletAddress?: string;
}

export default function Home({ isWalletConnected, connectWallet, walletAddress }: HomeProps) {
  const [showWalletConnectedDialog, setShowWalletConnectedDialog] = useState(false);
  const { toast } = useToast();

  // This effect will run when walletAddress changes
  useEffect(() => {
    if (walletAddress) {
      setShowWalletConnectedDialog(true);
    }
  }, [walletAddress]);

  return (
    <>
      <HeroSection connectWallet={connectWallet} />
      <HowItWorks />
      <FeaturedCourses />
      <CredentialVerification />
      <WalletConnect isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
      
      {/* Wallet Connected Dialog */}
      <Dialog open={showWalletConnectedDialog} onOpenChange={setShowWalletConnectedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto text-center">
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-success text-3xl"></i>
              </div>
              <DialogTitle className="text-xl font-semibold">Wallet Connected</DialogTitle>
              <DialogDescription className="text-neutral-600 mt-1">
                You have successfully connected your wallet to EduChain
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-500">Wallet Address</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Stellar Testnet</span>
            </div>
            <div className="font-mono text-sm break-all">{walletAddress}</div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowWalletConnectedDialog(false)}
            >
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
