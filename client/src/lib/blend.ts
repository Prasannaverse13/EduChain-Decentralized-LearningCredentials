// Blend Protocol Integration for EduChain
// Allows students to use educational credentials as collateral for educational loans

import * as StellarSdk from 'stellar-sdk';

// Blend Protocol Testnet Contract Addresses
export const BLEND_CONTRACTS = {
  // Core Blend Protocol Contracts (Testnet)
  BLND_TOKEN: 'CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF',
  USDC_TOKEN: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU',
  POOL_FACTORY: 'CDIE73IJJKOWXWCPU5GWQ745FUKWCSH3YKZRF5IQW7GE3G7YAZ773MYK',
  BACKSTOP: 'CC4TSDVQKBAYMK4BEDM65CSNB3ISI2A54OOBRO6IPSTFHJY3DEEKHRKV',
  LENDING_POOL: 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5',
  EMITTER: 'CA3WEGSM5ILLQKPJJUJJFZF6VG3K6NCQAOBQKF4WWWMRT4HWLQZYOVUD'
};

// Stellar testnet server configuration
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

export interface BlendLoanApplication {
  studentAddress: string;
  requestedAmount: number;
  collateralCredentials: string[];
  courseName: string;
  institutionName: string;
  loanTermMonths: number;
}

export interface BlendLoanStatus {
  loanId: string;
  borrowerAddress: string;
  principalAmount: number;
  interestRate: number;
  collateralValue: number;
  isActive: boolean;
  dueDate: string;
}

/**
 * Check if an account has sufficient BLND tokens for lending pool interaction
 */
export const checkBlendTokenBalance = async (publicKey: string): Promise<number> => {
  try {
    const account = await server.loadAccount(publicKey);
    const blndBalance = account.balances.find(balance => 
      balance.asset_type !== 'native' && 
      balance.asset_code === 'BLND' &&
      balance.asset_issuer === BLEND_CONTRACTS.BLND_TOKEN
    );
    
    return blndBalance ? parseFloat(blndBalance.balance) : 0;
  } catch (error) {
    console.error('Error checking BLND balance:', error);
    return 0;
  }
};

/**
 * Create a trustline for BLND token (required before using Blend Protocol)
 */
export const createBlendTrustline = async (userKeypair: StellarSdk.Keypair): Promise<string> => {
  try {
    const account = await server.loadAccount(userKeypair.publicKey());
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: new StellarSdk.Asset('BLND', BLEND_CONTRACTS.BLND_TOKEN),
      limit: '1000000' // Set reasonable limit
    }))
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: new StellarSdk.Asset('USDC', BLEND_CONTRACTS.USDC_TOKEN),
      limit: '1000000'
    }))
    .setTimeout(30)
    .build();
    
    transaction.sign(userKeypair);
    const result = await server.submitTransaction(transaction);
    
    return result.hash;
  } catch (error) {
    console.error('Error creating Blend trustlines:', error);
    throw error;
  }
};

/**
 * Calculate education loan eligibility based on credentials
 */
export const calculateLoanEligibility = (credentials: any[]): number => {
  if (!credentials || credentials.length === 0) return 0;
  
  // Base loan amount calculation based on credential value
  let baseAmount = 1000; // Base $1000 USDC
  
  // Increase loan amount based on number and quality of credentials
  credentials.forEach(credential => {
    if (credential.skills && credential.skills.length > 0) {
      baseAmount += credential.skills.length * 200; // $200 per skill
    }
    
    // Premium institutions get higher loan amounts
    const premiumInstitutions = ['MIT', 'Stanford', 'Harvard', 'Berkeley'];
    if (premiumInstitutions.some(inst => 
      credential.institution?.toLowerCase().includes(inst.toLowerCase())
    )) {
      baseAmount *= 1.5;
    }
  });
  
  // Cap maximum loan at $10,000 USDC
  return Math.min(baseAmount, 10000);
};

/**
 * Submit a loan application to Blend Protocol
 * This simulates the process - in production would interact with actual Blend contracts
 */
export const submitBlendLoanApplication = async (
  application: BlendLoanApplication
): Promise<{ success: boolean; loanId?: string; error?: string }> => {
  try {
    // Validate application
    if (!application.studentAddress || !application.requestedAmount) {
      throw new Error('Invalid loan application data');
    }
    
    // In a real implementation, this would:
    // 1. Call Blend's lending pool contract
    // 2. Deposit credentials as collateral
    // 3. Request loan from the pool
    // 4. Return actual loan terms
    
    // For demonstration, we simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain interaction
    
    const loanId = `BLEND_LOAN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      loanId
    };
    
  } catch (error) {
    console.error('Error submitting Blend loan application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get current interest rates from Blend Protocol pools
 */
export const getBlendInterestRates = async (): Promise<{
  lendingRate: number;
  borrowingRate: number;
}> => {
  try {
    // In production, this would query the actual Blend pool contracts
    // For now, we simulate realistic DeFi rates
    return {
      lendingRate: 4.5, // 4.5% APY for lenders
      borrowingRate: 7.2  // 7.2% APY for borrowers
    };
  } catch (error) {
    console.error('Error fetching Blend interest rates:', error);
    return {
      lendingRate: 0,
      borrowingRate: 0
    };
  }
};

/**
 * Get Blend Protocol pool statistics
 */
export const getBlendPoolStats = async (): Promise<{
  totalValueLocked: number;
  totalBorrowed: number;
  utilizationRate: number;
}> => {
  try {
    // In production, this would query actual pool data from Blend contracts
    return {
      totalValueLocked: 2500000, // $2.5M in the education lending pool
      totalBorrowed: 1800000,    // $1.8M currently borrowed
      utilizationRate: 72        // 72% utilization rate
    };
  } catch (error) {
    console.error('Error fetching Blend pool stats:', error);
    return {
      totalValueLocked: 0,
      totalBorrowed: 0,
      utilizationRate: 0
    };
  }
};

/**
 * Check loan status for a given borrower
 */
export const getBlendLoanStatus = async (borrowerAddress: string): Promise<BlendLoanStatus[]> => {
  try {
    // In production, this would query the borrower's active loans from Blend
    // For demonstration, return mock data if the address has previously applied
    return [
      {
        loanId: 'BLEND_LOAN_DEMO_001',
        borrowerAddress,
        principalAmount: 5000,
        interestRate: 7.2,
        collateralValue: 6500,
        isActive: true,
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching loan status:', error);
    return [];
  }
};

/**
 * Get Blend Protocol links for exploration
 */
export const getBlendProtocolLinks = () => {
  return {
    documentation: 'https://docs.blend.capital/',
    testnetUI: 'https://testnet.blend.capital/',
    mainnetUI: 'https://mainnet.blend.capital/',
    github: 'https://github.com/blend-capital',
    poolFactory: `https://stellar.expert/explorer/testnet/contract/${BLEND_CONTRACTS.POOL_FACTORY}`,
    blndToken: `https://stellar.expert/explorer/testnet/contract/${BLEND_CONTRACTS.BLND_TOKEN}`
  };
};