import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AboutProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function About({ isWalletConnected, walletAddress }: AboutProps) {
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">About EduChain</h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-neutral-600 mb-4">
                EduChain is dedicated to revolutionizing education through blockchain technology. We create a decentralized platform where learning achievements are securely recorded, easily verified, and globally recognized.
              </p>
              <p className="text-neutral-600 mb-4">
                By leveraging the Stellar blockchain, we provide tamper-proof credentials that empower learners to showcase their skills and knowledge, while giving employers and institutions a reliable way to verify educational accomplishments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <i className="fas fa-globe text-primary text-xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Global Access</h3>
                  <p className="text-sm text-neutral-600">Making education accessible worldwide with blockchain technology</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                    <i className="fas fa-shield-alt text-secondary text-xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Secure & Verifiable</h3>
                  <p className="text-sm text-neutral-600">Tamper-proof credentials stored on the Stellar blockchain</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <i className="fas fa-handshake text-accent text-xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Trust & Recognition</h3>
                  <p className="text-sm text-neutral-600">Building a network of trusted educational partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Stellar Blockchain Integration</h2>
              <p className="text-neutral-600 mb-4">
                EduChain is built on the Stellar blockchain, a fast, scalable, and low-cost network that's perfect for our educational credentialing system.
              </p>
              <div className="bg-neutral-100 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Why Stellar?</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                  <li>Fast transaction speeds (3-5 seconds)</li>
                  <li>Low transaction costs</li>
                  <li>Energy-efficient consensus protocol</li>
                  <li>Built-in asset issuance functionality</li>
                  <li>Smart contract capabilities</li>
                  <li>Global, inclusive financial infrastructure</li>
                </ul>
              </div>
              <p className="text-neutral-600">
                Each credential issued on EduChain is recorded as a transaction on the Stellar testnet, creating an immutable record that can be verified by anyone, anywhere, at any time.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline" className="flex items-center">
                  <a href="https://stellar.org" target="_blank">
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Learn more about Stellar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">For Educational Partners</h2>
              <p className="text-neutral-600 mb-4">
                Are you an educational institution, online learning platform, or course provider? Join our network to issue blockchain-verified credentials to your students.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary mb-2">Benefits for Partners</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mr-2 mt-1"></i>
                    <span>Issue tamper-proof digital credentials on Stellar</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mr-2 mt-1"></i>
                    <span>Reduce credential fraud and verification costs</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mr-2 mt-1"></i>
                    <span>Join a global network of educational innovators</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mr-2 mt-1"></i>
                    <span>Easy integration with existing systems</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Button className="bg-primary text-white" disabled>
                  <span className="mr-2">Coming Soon</span>
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Soon</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
