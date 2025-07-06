import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  ExternalLink,
  Calculator,
  BookOpen,
  CreditCard
} from 'lucide-react';
import {
  checkBlendTokenBalance,
  calculateLoanEligibility,
  submitBlendLoanApplication,
  getBlendInterestRates,
  getBlendPoolStats,
  getBlendLoanStatus,
  getBlendProtocolLinks,
  type BlendLoanApplication,
  type BlendLoanStatus
} from '@/lib/blend';

interface BlendIntegrationProps {
  isWalletConnected: boolean;
  walletAddress: string;
  userCredentials?: any[];
}

export default function BlendIntegration({ 
  isWalletConnected, 
  walletAddress, 
  userCredentials = [] 
}: BlendIntegrationProps) {
  const [blndBalance, setBlndBalance] = useState<number>(0);
  const [interestRates, setInterestRates] = useState({ lendingRate: 0, borrowingRate: 0 });
  const [poolStats, setPoolStats] = useState({ totalValueLocked: 0, totalBorrowed: 0, utilizationRate: 0 });
  const [loanStatus, setLoanStatus] = useState<BlendLoanStatus[]>([]);
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState<number>(0);
  
  const { toast } = useToast();
  const blendLinks = getBlendProtocolLinks();

  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      loadBlendData();
    }
  }, [isWalletConnected, walletAddress]);

  useEffect(() => {
    if (userCredentials.length > 0) {
      const eligible = calculateLoanEligibility(userCredentials);
      setEligibleAmount(eligible);
    }
  }, [userCredentials]);

  const loadBlendData = async () => {
    try {
      const [balance, rates, stats, loans] = await Promise.all([
        checkBlendTokenBalance(walletAddress),
        getBlendInterestRates(),
        getBlendPoolStats(),
        getBlendLoanStatus(walletAddress)
      ]);
      
      setBlndBalance(balance);
      setInterestRates(rates);
      setPoolStats(stats);
      setLoanStatus(loans);
    } catch (error) {
      console.error('Error loading Blend data:', error);
    }
  };

  const handleLoanApplication = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to apply for a loan.",
        variant: "destructive",
      });
      return;
    }

    if (!loanAmount || !courseName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const application: BlendLoanApplication = {
        studentAddress: walletAddress,
        requestedAmount: parseFloat(loanAmount),
        collateralCredentials: userCredentials.map(c => c.stellarTxHash || c.hash),
        courseName,
        institutionName: 'EduChain Academy',
        loanTermMonths: 12
      };

      const result = await submitBlendLoanApplication(application);
      
      if (result.success) {
        toast({
          title: "Loan Application Submitted",
          description: `Your education loan application has been submitted successfully. Loan ID: ${result.loanId}`,
        });
        
        // Reset form
        setLoanAmount('');
        setCourseName('');
        
        // Refresh loan status
        loadBlendData();
      } else {
        toast({
          title: "Application Failed",
          description: result.error || "Failed to submit loan application.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your application.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Blend Protocol Integration
          </CardTitle>
          <CardDescription>
            Educational loans powered by Blend Protocol - Connect your wallet to access funding options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to access decentralized educational funding through Blend Protocol.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Competitive Rates</h3>
                <p className="text-sm text-muted-foreground">Low interest rates for education loans</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Credential Collateral</h3>
                <p className="text-sm text-muted-foreground">Use your achievements as collateral</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">DeFi Powered</h3>
                <p className="text-sm text-muted-foreground">Built on Stellar & Blend Protocol</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Blend Protocol - Educational Finance
          </CardTitle>
          <CardDescription>
            Decentralized lending for education using your credentials as collateral
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pool Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Value Locked</span>
            </div>
            <p className="text-2xl font-bold">${poolStats.totalValueLocked.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Borrowing Rate</span>
            </div>
            <p className="text-2xl font-bold">{interestRates.borrowingRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Utilization Rate</span>
            </div>
            <p className="text-2xl font-bold">{poolStats.utilizationRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Your BLND Balance</span>
            </div>
            <p className="text-2xl font-bold">{blndBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Application */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Apply for Education Loan
            </CardTitle>
            <CardDescription>
              Use your credentials as collateral to fund your education
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userCredentials.length > 0 && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  Based on your {userCredentials.length} credential(s), you're eligible for up to ${eligibleAmount.toLocaleString()} USDC
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (USDC)</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Enter amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                max={eligibleAmount}
              />
              {eligibleAmount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Maximum eligible: ${eligibleAmount.toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Loan Terms</h4>
              <div className="text-sm space-y-1">
                <p>Interest Rate: {interestRates.borrowingRate}% APY</p>
                <p>Term: 12 months</p>
                <p>Collateral: Educational credentials</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLoanApplication} 
              disabled={isLoading || !loanAmount || !courseName}
              className="w-full"
            >
              {isLoading ? 'Submitting...' : 'Apply for Loan'}
            </Button>
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Your Active Loans</CardTitle>
            <CardDescription>Manage your current educational loans</CardDescription>
          </CardHeader>
          <CardContent>
            {loanStatus.length > 0 ? (
              <div className="space-y-4">
                {loanStatus.map((loan) => (
                  <div key={loan.loanId} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Loan #{loan.loanId.slice(-8)}</h4>
                      <Badge variant={loan.isActive ? "default" : "secondary"}>
                        {loan.isActive ? "Active" : "Closed"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Principal</p>
                        <p className="font-medium">${loan.principalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Collateral Value</p>
                        <p className="font-medium">${loan.collateralValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No active loans</p>
                <p className="text-sm text-muted-foreground">Apply for your first education loan above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Blend Protocol Links */}
      <Card>
        <CardHeader>
          <CardTitle>Blend Protocol Resources</CardTitle>
          <CardDescription>Learn more about the underlying DeFi protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild>
              <a href={blendLinks.documentation} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={blendLinks.testnetUI} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Testnet App
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={blendLinks.poolFactory} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Pool Factory
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}