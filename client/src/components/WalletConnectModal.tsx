import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (type: "metamask" | "freighter") => Promise<boolean>;
}

export default function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  
  const handleConnectWallet = async (type: "metamask" | "freighter") => {
    setIsConnecting(true);
    
    try {
      const connected = await onConnect(type);
      
      if (connected) {
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to your ${type === "metamask" ? "MetaMask" : "Freighter"} wallet.`,
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${type === "metamask" ? "MetaMask" : "Freighter"} wallet. Make sure the extension is installed and you have granted permissions.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "An error occurred while connecting to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect with EduChain and manage your credentials.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          <div 
            className="flex flex-col items-center p-6 border rounded-xl bg-white border-neutral-200 opacity-75"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
              <i className="fas fa-rocket text-primary text-2xl"></i>
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                Soon
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Freighter Wallet</h3>
            <p className="text-sm text-center text-neutral-600 mb-4">
              Connect with Freighter wallet for Stellar blockchain operations.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={true}
            >
              Coming Soon
            </Button>
            <p className="text-xs text-center text-amber-600 mt-2">
              Integration in progress for the hackathon
            </p>
          </div>
          
          <div 
            className="flex flex-col items-center p-6 border rounded-xl cursor-pointer bg-white hover:border-primary transition-colors"
            onClick={() => !isConnecting && handleConnectWallet("metamask")}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="fas fa-mask text-primary text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">MetaMask Wallet</h3>
            <p className="text-sm text-center text-neutral-600 mb-4">
              Connect with MetaMask wallet for Ethereum blockchain operations.
            </p>
            <Button 
              variant="default" 
              className="w-full"
              disabled={isConnecting}
              onClick={(e) => {
                e.stopPropagation();
                handleConnectWallet("metamask");
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect to MetaMask'}
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-center text-sm text-neutral-600">
          <p>
            Don't have a wallet?{" "}
            <a 
              href="https://www.freighter.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Install Freighter
            </a>{" "}
            or{" "}
            <a 
              href="https://metamask.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Install MetaMask
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}