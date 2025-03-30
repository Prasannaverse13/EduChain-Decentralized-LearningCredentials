import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { verifyCredential, CONTRACT_ID, getContractLink } from '@/lib/stellar';

interface VerifiedCredential {
  hash: string;
  title: string;
  recipient: string;
  institution: string;
  issuedAt: string;
  skills: string[];
}

export default function CredentialVerification() {
  const [credentialHash, setCredentialHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCredential, setVerifiedCredential] = useState<VerifiedCredential | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentialHash) {
      toast({
        title: "Verification Failed",
        description: "Please enter a credential hash or ID",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Call the API to verify the credential on Stellar blockchain
      const result = await verifyCredential(credentialHash);
      
      if (!result) {
        throw new Error("Credential verification failed. The hash may be invalid or the credential doesn't exist.");
      }
      
      // Format the data from blockchain to match our UI needs
      const verified: VerifiedCredential = {
        hash: credentialHash,
        title: result.credentialData?.title || "Verified Credential",
        recipient: result.credentialData?.recipient || "Unknown Recipient",
        institution: result.credentialData?.issuer || "Unknown Issuer",
        issuedAt: new Date(result.credentialData?.issueDate || Date.now()).toLocaleDateString(),
        skills: ["Blockchain", "Stellar"] // Skills may not be in the blockchain data
      };
      
      setVerifiedCredential(verified);
      setIsVerifying(false);
      
      toast({
        title: "Credential Verified",
        description: "The credential has been successfully verified on the Stellar blockchain.",
        variant: "default",
      });
    } catch (error) {
      console.error("Verification error:", error);
      setIsVerifying(false);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Could not verify credential. Please check the hash and try again.",
        variant: "destructive",
      });
    }
  };

  const activateCamera = () => {
    setIsCameraActive(true);
    toast({
      title: "Camera Activation",
      description: "Camera access requested for QR code scanning.",
      variant: "default",
    });
    // In a real implementation, this would activate the device camera
    // and scan for QR codes containing credential hashes
  };

  return (
    <section id="credentials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Credential Verification</h2>
            <p className="text-neutral-600">Instantly verify the authenticity of any credential issued on our platform</p>
          </div>
          
          <div className="bg-neutral-50 rounded-xl p-8">
            {/* Verification Form */}
            <form onSubmit={handleVerification} className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="credentialHash" className="text-sm font-medium text-neutral-700 mb-1">
                    Credential Hash or ID
                  </Label>
                  <Input 
                    id="credentialHash" 
                    value={credentialHash}
                    onChange={(e) => setCredentialHash(e.target.value)}
                    placeholder="Enter credential hash or scan QR code" 
                    className="w-full px-4 py-3 rounded-lg"
                  />
                </div>
                <div className="md:mt-7">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-primary text-white hover:bg-primary/90"
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Credential'}
                  </Button>
                </div>
              </div>
            </form>
            
            {/* QR Code Scanner Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-lg border border-neutral-200">
              <div className="w-full md:w-1/3 aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative">
                {isCameraActive ? (
                  <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white">Camera active</span>
                    {/* Real camera feed would be shown here */}
                  </div>
                ) : (
                  <i className="fas fa-qrcode text-6xl text-neutral-400"></i>
                )}
              </div>
              
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
                <p className="text-neutral-600 mb-4">Use your device camera to scan a credential QR code for instant verification on the Stellar blockchain.</p>
                <Button 
                  onClick={activateCamera}
                  className="bg-secondary text-white hover:bg-secondary/90 transition items-center"
                  size="sm"
                  disabled={isCameraActive}
                >
                  <i className="fas fa-camera mr-2"></i>
                  {isCameraActive ? 'Camera Active' : 'Activate Camera'}
                </Button>
              </div>
              {/* Contract Information */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex flex-col items-center text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/10 text-primary px-3 py-1">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Powered by Stellar Smart Contract
                  </Badge>
                  <div className="text-sm text-neutral-600 mb-2">
                    All credentials on EduChain are verified using our deployed Stellar smart contract
                  </div>
                  <div className="text-xs text-neutral-500 font-mono mb-2 break-all">
                    Contract ID: {CONTRACT_ID}
                  </div>
                  <a 
                    href={getContractLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center"
                  >
                    <i className="fas fa-external-link-alt mr-1"></i>
                    View Contract on Stellar Expert
                  </a>
                </div>
              </div>
            </div>
          </div>
        
          {/* Example or Verified Credential */}
          {verifiedCredential ? (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Verified Credential</h3>
              <Card className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-success/10 text-success px-3 py-1 flex items-center">
                      <i className="fas fa-check-circle mr-2"></i>
                      Verified on Stellar
                    </Badge>
                  </div>
                  <div className="text-sm text-neutral-500">
                    <i className="fas fa-calendar mr-1"></i>
                    Issued: {verifiedCredential.issuedAt}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-neutral-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0" style={{
                        background: "conic-gradient(transparent, rgba(124, 65, 245, 0.3), transparent 30%)",
                        animation: "rotate 4s linear infinite"
                      }}></div>
                      <div className="z-10">
                        <div className="w-24 h-24 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                          <i className="fas fa-award text-primary text-4xl"></i>
                        </div>
                        <h4 className="text-lg font-semibold mb-1">Blockchain Developer</h4>
                        <p className="text-neutral-600 text-sm">Certificate of Completion</p>
                        <div className="mt-4 text-xs text-neutral-500 break-all">
                          <span className="font-medium">Hash:</span> 
                          <span>{`${verifiedCredential.hash.substring(0, 4)}...${verifiedCredential.hash.substring(verifiedCredential.hash.length - 3)}`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-semibold mb-2">{verifiedCredential.title}</h3>
                      <p className="text-neutral-600 mb-4">This credential certifies that the holder has successfully completed all requirements for the Blockchain Developer program, demonstrating proficiency in blockchain fundamentals, smart contracts, and decentralized applications.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Recipient</div>
                          <div className="font-medium">{verifiedCredential.recipient}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Issuing Institution</div>
                          <div className="font-medium">{verifiedCredential.institution}</div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Skills</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {verifiedCredential.skills.map((skill, index) => (
                              <span key={index} className="bg-neutral-100 px-2 py-0.5 rounded text-xs">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <i className="fas fa-download mr-2"></i>
                          Download PDF
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
            </div>
          ) : (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Example Verified Credential</h3>
              <Card className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-success/10 text-success px-3 py-1 flex items-center">
                      <i className="fas fa-check-circle mr-2"></i>
                      Verified on Stellar
                    </Badge>
                  </div>
                  <div className="text-sm text-neutral-500">
                    <i className="fas fa-calendar mr-1"></i>
                    Issued: March 30, 2025
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-neutral-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0" style={{
                        background: "conic-gradient(transparent, rgba(124, 65, 245, 0.3), transparent 30%)",
                        animation: "rotate 4s linear infinite"
                      }}></div>
                      <div className="z-10">
                        <div className="w-24 h-24 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                          <i className="fas fa-award text-primary text-4xl"></i>
                        </div>
                        <h4 className="text-lg font-semibold mb-1">Blockchain Developer</h4>
                        <p className="text-neutral-600 text-sm">Certificate of Completion</p>
                        <div className="mt-4 text-xs text-neutral-500 break-all">
                          <span className="font-medium">Hash:</span> 
                          <span>STE...X3F</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-semibold mb-2">Blockchain Developer Certification</h3>
                      <p className="text-neutral-600 mb-4">This credential certifies that the holder has successfully completed all requirements for the Blockchain Developer program, demonstrating proficiency in blockchain fundamentals, smart contracts, and decentralized applications.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Recipient</div>
                          <div className="font-medium">Alicia Rodriguez</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Issuing Institution</div>
                          <div className="font-medium">Blockchain Academy</div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-neutral-500 mb-1">Skills</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs">Blockchain</span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs">Smart Contracts</span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs">Stellar</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <i className="fas fa-download mr-2"></i>
                          Download PDF
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
