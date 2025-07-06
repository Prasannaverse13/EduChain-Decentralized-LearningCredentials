// Server-side Blend Protocol integration for EduChain
// Handles educational loan applications and credential-based lending

import * as StellarSdk from 'stellar-sdk';

// Blend Protocol Contract Addresses (Testnet)
export const BLEND_TESTNET_CONTRACTS = {
  BLND_TOKEN: 'CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF',
  USDC_TOKEN: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU',
  POOL_FACTORY: 'CDIE73IJJKOWXWCPU5GWQ745FUKWCSH3YKZRF5IQW7GE3G7YAZ773MYK',
  BACKSTOP: 'CC4TSDVQKBAYMK4BEDM65CSNB3ISI2A54OOBRO6IPSTFHJY3DEEKHRKV',
  LENDING_POOL: 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5',
  EMITTER: 'CA3WEGSM5ILLQKPJJUJJFZF6VG3K6NCQAOBQKF4WWWMRT4HWLQZYOVUD'
};

// Stellar server configuration
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

export interface BlendLoanRequest {
  borrowerPublicKey: string;
  collateralCredentials: string[];
  requestedAmount: number;
  courseName: string;
  institutionName: string;
  loanTermMonths: number;
}

export interface BlendLoanOffer {
  loanId: string;
  borrowerAddress: string;
  principalAmount: number;
  interestRate: number;
  collateralRequired: number;
  loanTermMonths: number;
  isApproved: boolean;
  createdAt: string;
}

/**
 * Validate a borrower's account for Blend Protocol interaction
 */
export const validateBlendBorrower = async (publicKey: string): Promise<{
  isValid: boolean;
  hasBlndTrustline: boolean;
  hasUsdcTrustline: boolean;
  blndBalance: number;
  usdcBalance: number;
}> => {
  try {
    const account = await server.loadAccount(publicKey);
    
    let hasBlndTrustline = false;
    let hasUsdcTrustline = false;
    let blndBalance = 0;
    let usdcBalance = 0;
    
    account.balances.forEach(balance => {
      if (balance.asset_type !== 'native') {
        if (balance.asset_code === 'BLND' && balance.asset_issuer === BLEND_TESTNET_CONTRACTS.BLND_TOKEN) {
          hasBlndTrustline = true;
          blndBalance = parseFloat(balance.balance);
        }
        if (balance.asset_code === 'USDC' && balance.asset_issuer === BLEND_TESTNET_CONTRACTS.USDC_TOKEN) {
          hasUsdcTrustline = true;
          usdcBalance = parseFloat(balance.balance);
        }
      }
    });
    
    return {
      isValid: true,
      hasBlndTrustline,
      hasUsdcTrustline,
      blndBalance,
      usdcBalance
    };
  } catch (error) {
    console.error('Error validating Blend borrower:', error);
    return {
      isValid: false,
      hasBlndTrustline: false,
      hasUsdcTrustline: false,
      blndBalance: 0,
      usdcBalance: 0
    };
  }
};

/**
 * Calculate loan terms based on educational credentials
 */
export const calculateLoanTerms = (credentials: any[], requestedAmount: number): {
  approvedAmount: number;
  interestRate: number;
  collateralRatio: number;
  isApproved: boolean;
  riskScore: number;
} => {
  if (!credentials || credentials.length === 0) {
    return {
      approvedAmount: 0,
      interestRate: 0,
      collateralRatio: 0,
      isApproved: false,
      riskScore: 100 // High risk
    };
  }

  // Base scoring system for educational credentials
  let credentialScore = 0;
  let institutionScore = 0;
  let skillsScore = 0;

  credentials.forEach(credential => {
    // Score based on credential type and institution
    credentialScore += 10; // Base points per credential
    
    // Bonus for recognized institutions
    const premiumInstitutions = ['MIT', 'Stanford', 'Harvard', 'Berkeley', 'Caltech'];
    if (premiumInstitutions.some(inst => 
      credential.institution?.toLowerCase().includes(inst.toLowerCase())
    )) {
      institutionScore += 20;
    } else {
      institutionScore += 5; // Other institutions
    }
    
    // Score based on skills diversity
    if (credential.skills && credential.skills.length > 0) {
      skillsScore += credential.skills.length * 2;
    }
  });

  const totalScore = credentialScore + institutionScore + skillsScore;
  const riskScore = Math.max(10, 100 - totalScore); // Lower is better

  // Calculate loan terms based on risk score
  const maxLoanAmount = Math.min(requestedAmount, totalScore * 100); // $100 per point
  const interestRate = Math.max(5, riskScore * 0.1); // 5% minimum, risk-adjusted
  const collateralRatio = Math.min(150, 100 + riskScore); // 100-150% collateral ratio

  return {
    approvedAmount: maxLoanAmount,
    interestRate: parseFloat(interestRate.toFixed(2)),
    collateralRatio: parseFloat(collateralRatio.toFixed(0)),
    isApproved: totalScore >= 20, // Minimum score for approval
    riskScore
  };
};

/**
 * Process a Blend Protocol loan application
 */
export const processBlendLoanApplication = async (
  loanRequest: BlendLoanRequest
): Promise<BlendLoanOffer> => {
  try {
    // Validate borrower account
    const validation = await validateBlendBorrower(loanRequest.borrowerPublicKey);
    
    if (!validation.isValid) {
      throw new Error('Invalid borrower account');
    }

    // Calculate loan terms based on credentials
    // Note: In production, this would fetch actual credential data from blockchain
    const mockCredentials = loanRequest.collateralCredentials.map((hash, index) => ({
      id: index + 1,
      txHash: hash,
      institution: index === 0 ? 'MIT' : 'EduChain Academy',
      skills: index === 0 ? ['Blockchain', 'Smart Contracts', 'DeFi'] : ['Programming', 'Web3']
    }));

    const loanTerms = calculateLoanTerms(mockCredentials, loanRequest.requestedAmount);

    // Generate loan offer
    const loanOffer: BlendLoanOffer = {
      loanId: `BLEND_LOAN_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      borrowerAddress: loanRequest.borrowerPublicKey,
      principalAmount: loanTerms.approvedAmount,
      interestRate: loanTerms.interestRate,
      collateralRequired: Math.round(loanTerms.approvedAmount * (loanTerms.collateralRatio / 100)),
      loanTermMonths: loanRequest.loanTermMonths,
      isApproved: loanTerms.isApproved,
      createdAt: new Date().toISOString()
    };

    return loanOffer;

  } catch (error) {
    console.error('Error processing Blend loan application:', error);
    throw error;
  }
};

/**
 * Get current Blend Protocol pool statistics
 */
export const getBlendPoolStatistics = async (): Promise<{
  totalSupplied: number;
  totalBorrowed: number;
  availableLiquidity: number;
  utilizationRate: number;
  supplyRate: number;
  borrowRate: number;
}> => {
  try {
    // In production, this would query actual Blend Protocol contracts
    // For demonstration, return realistic DeFi pool statistics
    
    const totalSupplied = 2750000; // $2.75M total supplied
    const totalBorrowed = 1980000; // $1.98M total borrowed
    const availableLiquidity = totalSupplied - totalBorrowed;
    const utilizationRate = (totalBorrowed / totalSupplied) * 100;
    
    // Interest rates based on utilization (typical DeFi curve)
    const supplyRate = utilizationRate * 0.08; // Supply APY
    const borrowRate = supplyRate * 1.5; // Borrow APY (higher than supply)

    return {
      totalSupplied,
      totalBorrowed,
      availableLiquidity,
      utilizationRate: parseFloat(utilizationRate.toFixed(2)),
      supplyRate: parseFloat(supplyRate.toFixed(2)),
      borrowRate: parseFloat(borrowRate.toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching Blend pool statistics:', error);
    throw error;
  }
};

/**
 * Get Blend Protocol contract information
 */
export const getBlendContractInfo = () => {
  return {
    contracts: BLEND_TESTNET_CONTRACTS,
    network: 'testnet',
    documentation: 'https://docs.blend.capital/',
    github: 'https://github.com/blend-capital',
    poolFactoryExplorer: `https://stellar.expert/explorer/testnet/contract/${BLEND_TESTNET_CONTRACTS.POOL_FACTORY}`,
    blndTokenExplorer: `https://stellar.expert/explorer/testnet/contract/${BLEND_TESTNET_CONTRACTS.BLND_TOKEN}`
  };
};