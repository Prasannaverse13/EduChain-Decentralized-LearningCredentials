import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  isWalletConnected: boolean;
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
}

export default function WalletConnect({ isWalletConnected, connectWallet }: WalletConnectProps) {
  const { toast } = useToast();

  const handleConnectMetamask = async () => {
    try {
      const connected = await connectWallet("metamask");
      if (connected) {
        toast({
          title: "MetaMask Connected",
          description: "You have successfully connected your MetaMask wallet",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect MetaMask wallet",
        variant: "destructive",
      });
    }
  };

  const handleConnectFreighter = async () => {
    try {
      const connected = await connectWallet("freighter");
      if (connected) {
        toast({
          title: "Freighter Connected",
          description: "You have successfully connected your Freighter wallet",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect Freighter wallet",
        variant: "destructive",
      });
    }
  };

  if (isWalletConnected) {
    return null; // Don't show section if wallet is already connected
  }

  return (
    <section className="py-16 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-neutral-300">Connect your blockchain wallet to access all features of the platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Metamask Wallet */}
            <Card className="bg-neutral-800 border-neutral-700 hover:border-neutral-600 transition cursor-pointer" onClick={handleConnectMetamask}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-400 flex items-center justify-center mr-4">
                    <i className="fas fa-fox text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Metamask</h3>
                    <p className="text-neutral-400 text-sm">Popular Ethereum wallet</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4">Connect your Metamask wallet to access your credentials and interact with the Stellar network.</p>
                <div className="flex items-center text-sm text-neutral-400">
                  <i className="fas fa-info-circle mr-2"></i>
                  <span>Requires Metamask browser extension</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Freighter Wallet */}
            <Card className="bg-neutral-800 border-neutral-700 hover:border-neutral-600 transition cursor-pointer" onClick={handleConnectFreighter}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mr-4">
                    <i className="fas fa-rocket text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Freighter</h3>
                    <p className="text-neutral-400 text-sm">Stellar network wallet</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4">Connect your Freighter wallet for the best experience with Stellar-based credentials and transactions.</p>
                <div className="flex items-center text-sm text-neutral-400">
                  <i className="fas fa-info-circle mr-2"></i>
                  <span>Recommended for Stellar network</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-300">
              <i className="fas fa-shield-alt text-accent mr-2"></i>
              <span>Your credentials and private keys never leave your device</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
