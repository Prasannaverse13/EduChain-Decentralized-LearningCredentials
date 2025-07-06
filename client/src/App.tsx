import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetails from "@/pages/CourseDetails";
import CreateCourse from "@/pages/CreateCourse";
import Credentials from "@/pages/Credentials";
import BlendFinance from "@/pages/BlendFinance";
import About from "@/pages/About";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useWallet from "@/hooks/useWallet";

function Router({ isWalletConnected, walletAddress, connectWallet, disconnectWallet, walletType }: {
  isWalletConnected: boolean;
  walletAddress: string;
  walletType: string;
  connectWallet: (type: "metamask" | "freighter") => Promise<boolean>;
  disconnectWallet: () => void;
}) {
  return (
    <Switch>
      <Route 
        path="/" 
        component={() => (
          <Home 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress} 
            connectWallet={connectWallet}
          />
        )} 
      />
      <Route 
        path="/courses" 
        component={() => (
          <Courses 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
          />
        )} 
      />
      <Route 
        path="/courses/create" 
        component={() => (
          <CreateCourse 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
          />
        )} 
      />
      <Route 
        path="/courses/:id" 
        component={() => (
          <CourseDetails 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
          />
        )} 
      />
      <Route 
        path="/credentials" 
        component={() => (
          <Credentials 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
            walletType={walletType}
          />
        )} 
      />
      <Route 
        path="/finance" 
        component={() => (
          <BlendFinance 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
          />
        )} 
      />
      <Route 
        path="/about" 
        component={() => (
          <About 
            isWalletConnected={isWalletConnected} 
            walletAddress={walletAddress}
          />
        )} 
      />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Use the wallet hook for functionality
  const { 
    isConnected: isWalletConnected, 
    walletAddress, 
    walletType, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header 
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
        <main className="flex-grow">
          <Router 
            isWalletConnected={isWalletConnected}
            walletAddress={walletAddress}
            walletType={walletType}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
          />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
