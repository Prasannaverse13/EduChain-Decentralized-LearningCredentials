import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Credential {
  id: number;
  title: string;
  description: string;
  issuedAt: string;
  recipient: string;
  issuer: string;
  stellarTxHash: string;
  skills: string[];
}

interface CredentialsProps {
  isWalletConnected: boolean;
  walletAddress: string;
  walletType: string;
}

export default function Credentials({ isWalletConnected, walletAddress, walletType }: CredentialsProps) {
  const { toast } = useToast();
  const [verificationHash, setVerificationHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCredential, setVerifiedCredential] = useState<Credential | null>(null);

  // Fetch user's credentials
  const { data: userCredentials, isLoading, error } = useQuery<Credential[]>({
    queryKey: ['/api/credentials/me'],
  });

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationHash) {
      toast({
        title: "Verification Failed",
        description: "Please enter a credential hash",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // In a real app, this would call the API to verify on Stellar
      setTimeout(() => {
        const mockVerifiedCredential: Credential = {
          id: 999,
          title: "Blockchain Developer Certification",
          description: "This credential certifies that the holder has successfully completed all requirements for the Blockchain Developer program, demonstrating proficiency in blockchain fundamentals, smart contracts, and decentralized applications.",
          issuedAt: "March 15, 2025",
          recipient: "Alicia Rodriguez",
          issuer: "Blockchain Academy",
          stellarTxHash: verificationHash,
          skills: ["Blockchain", "Smart Contracts", "Stellar"]
        };
        
        setVerifiedCredential(mockVerifiedCredential);
        setIsVerifying(false);
        
        toast({
          title: "Credential Verified",
          description: "The credential has been successfully verified on the Stellar blockchain.",
          variant: "default",
        });
      }, 1500);
    } catch (error) {
      setIsVerifying(false);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Could not verify credential. Please check the hash and try again.",
        variant: "destructive",
      });
    }
  };

  // Fallback credentials if API hasn't returned data yet
  const fallbackCredentials: Credential[] = [
    {
      id: 1,
      title: "Blockchain Fundamentals Certificate",
      description: "Successfully completed the Blockchain Fundamentals course with distinction.",
      issuedAt: "January 12, 2025",
      recipient: "Current User",
      issuer: "Blockchain Academy",
      stellarTxHash: "8f9z...3k2j",
      skills: ["Blockchain", "Cryptography", "Distributed Systems"]
    },
    {
      id: 2,
      title: "Stellar Development Certification",
      description: "Mastered Stellar blockchain development and created real-world applications.",
      issuedAt: "February 28, 2025",
      recipient: "Current User",
      issuer: "Stellar Development Foundation",
      stellarTxHash: "7h2d...9f3g",
      skills: ["Stellar", "Blockchain Development", "Smart Contracts"]
    }
  ];

  const displayCredentials = userCredentials || fallbackCredentials;

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Credentials</h1>
          <p className="text-neutral-600 mb-8">View and verify blockchain-secured educational credentials</p>
          
          <Tabs defaultValue="my-credentials">
            <TabsList className="mb-8 bg-white">
              <TabsTrigger value="my-credentials">My Credentials</TabsTrigger>
              <TabsTrigger value="verify">Verify Credential</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-credentials">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                      <div className="h-6 bg-neutral-200 w-1/3 mb-4"></div>
                      <div className="h-4 bg-neutral-200 w-3/4 mb-6"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-neutral-200 w-1/2"></div>
                        <div className="h-4 bg-neutral-200 w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                  <p>Failed to load your credentials. Please try again later.</p>
                </div>
              ) : displayCredentials.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-certificate text-neutral-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Credentials Yet</h3>
                  <p className="text-neutral-600 mb-6">You haven't earned any blockchain credentials yet. Complete a course to get started.</p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {displayCredentials.map((credential) => (
                    <Card key={credential.id} className="border border-neutral-200 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4 aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-neutral-200 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0" style={{
                              background: "conic-gradient(transparent, rgba(124, 65, 245, 0.3), transparent 30%)",
                              animation: "rotate 4s linear infinite"
                            }}></div>
                            <div className="z-10">
                              <div className="w-16 h-16 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-award text-primary text-2xl"></i>
                              </div>
                              <h4 className="text-sm font-semibold mb-1 line-clamp-2">{credential.title}</h4>
                              <p className="text-neutral-600 text-xs">Issued: {credential.issuedAt}</p>
                            </div>
                          </div>
                          
                          <div className="w-full md:w-3/4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold">{credential.title}</h3>
                              <Badge variant="outline" className="bg-success/10 text-success">Verified</Badge>
                            </div>
                            
                            <p className="text-neutral-600 mb-4">{credential.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-sm font-medium text-neutral-500 mb-1">Issuer</div>
                                <div className="font-medium">{credential.issuer}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-500 mb-1">Stellar Transaction</div>
                                <div className="font-medium text-primary">
                                  <a href={`https://testnet.steexp.com/tx/${credential.stellarTxHash}`} target="_blank" className="hover:underline">
                                    {credential.stellarTxHash.substring(0, 4)}...{credential.stellarTxHash.substring(credential.stellarTxHash.length - 4)}
                                  </a>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-500 mb-1">Skills</div>
                                <div className="flex flex-wrap gap-2">
                                  {credential.skills.map((skill, index) => (
                                    <span key={index} className="bg-neutral-100 px-2 py-0.5 rounded text-xs">{skill}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" className="flex items-center">
                                <i className="fas fa-download mr-2"></i>
                                Download
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <i className="fas fa-share-alt mr-2"></i>
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="verify">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Verify a Credential</h3>
                  <p className="text-neutral-600 mb-6">Enter a credential hash or ID to verify its authenticity on the Stellar blockchain.</p>
                  
                  <form onSubmit={handleVerification} className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="verifyHash">Credential Hash or ID</Label>
                        <Input 
                          id="verifyHash" 
                          value={verificationHash}
                          onChange={(e) => setVerificationHash(e.target.value)}
                          placeholder="Enter credential hash" 
                          className="mt-1"
                        />
                      </div>
                      <div className="md:self-end">
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto bg-primary text-white"
                          disabled={isVerifying}
                        >
                          {isVerifying ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  {verifiedCredential && (
                    <div className="border border-neutral-200 rounded-xl p-6 mt-6">
                      <div className="flex items-center mb-4">
                        <Badge variant="outline" className="bg-success/10 text-success mr-2">Verified</Badge>
                        <h4 className="text-lg font-semibold">{verifiedCredential.title}</h4>
                      </div>
                      
                      <p className="text-neutral-600 mb-4">{verifiedCredential.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Recipient</div>
                          <div className="font-medium">{verifiedCredential.recipient}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Issuer</div>
                          <div className="font-medium">{verifiedCredential.issuer}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Issue Date</div>
                          <div className="font-medium">{verifiedCredential.issuedAt}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Stellar Transaction</div>
                          <div className="font-medium text-primary">
                            <a href={`https://testnet.steexp.com/tx/${verifiedCredential.stellarTxHash}`} target="_blank" className="hover:underline">
                              View on Explorer
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
