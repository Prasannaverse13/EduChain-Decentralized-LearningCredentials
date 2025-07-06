import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import WalletConnectModal from './WalletConnectModal';

interface HeaderProps {
  isWalletConnected: boolean;
  walletAddress: string;
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
  disconnectWallet: () => void;
}

export default function Header({ 
  isWalletConnected, 
  walletAddress,
  connectWallet,
  disconnectWallet 
}: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const getWalletShortAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-xl font-semibold text-neutral-800">EduChain</span>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className={`font-medium cursor-pointer ${location === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                Home
              </div>
            </Link>
            <Link href="/courses">
              <div className={`font-medium cursor-pointer ${location === '/courses' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                Courses
              </div>
            </Link>
            <Link href="/credentials">
              <div className={`font-medium cursor-pointer ${location === '/credentials' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                Credentials
              </div>
            </Link>
            <Link href="/finance">
              <div className={`font-medium cursor-pointer ${location === '/finance' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                Finance
              </div>
            </Link>
            <Link href="/about">
              <div className={`font-medium cursor-pointer ${location === '/about' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                About
              </div>
            </Link>
          </nav>
          
          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            
            {!isWalletConnected ? (
              <Button 
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-primary text-white hover:bg-primary/90 transition flex items-center"
                size="sm"
              >
                <i className="fas fa-wallet mr-2"></i>
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <i className="fas fa-circle text-[8px] mr-2"></i>
                  <span>{getWalletShortAddress(walletAddress)}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-primary/10">
                      <i className="fas fa-user text-primary"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">My Profile</DropdownMenuItem>
                    <Link href="/credentials">
                      <DropdownMenuItem className="font-medium">My Credentials</DropdownMenuItem>
                    </Link>
                    <Link href="/courses">
                      <DropdownMenuItem className="font-medium">My Courses</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href="/courses/create">
                      <DropdownMenuItem className="font-medium text-primary">
                        <i className="fas fa-plus-circle mr-2"></i>
                        Create Course
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={disconnectWallet}
                      className="text-red-500 focus:text-red-500"
                    >
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-neutral-700" onClick={toggleMobileMenu}>
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/">
                <div className={`font-medium py-2 cursor-pointer ${location === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                  Home
                </div>
              </Link>
              <Link href="/courses">
                <div className={`font-medium py-2 cursor-pointer ${location === '/courses' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                  Courses
                </div>
              </Link>
              <Link href="/credentials">
                <div className={`font-medium py-2 cursor-pointer ${location === '/credentials' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                  Credentials
                </div>
              </Link>
              <Link href="/finance">
                <div className={`font-medium py-2 cursor-pointer ${location === '/finance' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                  Finance
                </div>
              </Link>
              <Link href="/about">
                <div className={`font-medium py-2 cursor-pointer ${location === '/about' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>
                  About
                </div>
              </Link>
              {isWalletConnected && (
                <Link href="/courses/create">
                  <div className={`font-medium py-2 cursor-pointer text-primary flex items-center ${location === '/courses/create' ? 'text-primary' : 'text-primary hover:text-primary/80'}`}>
                    <i className="fas fa-plus-circle mr-2"></i>
                    Create Course
                  </div>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={handleCloseWalletModal}
        onConnect={connectWallet}
      />
    </>
  );
}
