import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import WalletConnectModal from './WalletConnectModal';

interface HeroSectionProps {
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
}

export default function HeroSection({ connectWallet }: HeroSectionProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <section className="relative">
        <div className="bg-gradient-to-r from-[rgba(45,78,245,0.9)] to-[rgba(124,65,245,0.9)] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Decentralized Learning Credentials on Stellar</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">Secure, verifiable, and globally recognized educational achievements powered by blockchain technology</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={() => setIsWalletModalOpen(true)} 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-neutral-100 w-full sm:w-auto"
                >
                  <i className="fas fa-wallet mr-2"></i>
                  Connect Wallet
                </Button>
                <Button 
                  className="bg-secondary text-neutral-900 hover:bg-secondary/90 w-full sm:w-auto font-medium"
                  asChild
                >
                  <a href="#courses">Explore Courses</a>
                </Button>
              </div>
              <div className="mt-8 inline-flex items-center bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
                <i className="fas fa-info-circle text-accent mr-2"></i>
                <span className="text-sm">Running on Stellar Testnet</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="container mx-auto px-4 relative -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-neutral-600">Credentials Issued</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-neutral-600">Educational Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-neutral-600">Global Learners</div>
            </div>
          </div>
        </div>
      </section>
      
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={connectWallet}
      />
    </>
  );
}
