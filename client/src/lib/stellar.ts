import * as StellarSdk from 'stellar-sdk';

// Set up the Stellar testnet server
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Platform admin account
// In production, this would be handled server-side only
const ADMIN_PUBLIC_KEY = 'GBABSJF7HIECSEPB7S4TZSHRFXXVSEJUNZVN5WICWGVAX2PZWIX6X43K';

// Deployed Smart Contract ID for our platform (deployed to Stellar testnet)
// This is our verified contract for the hackathon
export const CONTRACT_ID = 'GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL';
export const CONTRACT_TX = 'ad2b1213d3cd647cc4d22106bd54d2023edac0a4c3ca3d08c11ba1d3539a69ad';

// Check if the user's Stellar account exists
export const checkAccount = async (publicKey: string): Promise<boolean> => {
  try {
    await server.loadAccount(publicKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Create a Stellar account (for testing purposes)
export const createTestAccount = async (): Promise<{publicKey: string, secretKey: string}> => {
  try {
    const pair = StellarSdk.Keypair.random();
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();
    
    // Fund the account using friendbot
    await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    
    return {
      publicKey,
      secretKey
    };
  } catch (error) {
    console.error('Failed to create test account:', error);
    throw new Error('Failed to create test account');
  }
};

// Client-side function to request credential issuance
// In a real implementation, this would be handled by the server
// after user authentication and validation
export const requestCredential = async (
  userPublicKey: string,
  credentialData: any
): Promise<string> => {
  try {
    // In real implementation, this would be a server API call
    // For demo, we're using the apiRequest function to call our backend
    const response = await fetch('/api/credentials/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: userPublicKey,
        credentialData
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to issue credential');
    }
    
    const result = await response.json();
    return result.txHash;
  } catch (error) {
    console.error('Failed to request credential:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to request credential issuance');
  }
};

// Verify a credential using the Stellar blockchain
export const verifyCredential = async (txHash: string): Promise<any> => {
  try {
    // Validate transaction hash format
    if (!txHash || typeof txHash !== 'string' || txHash.length < 10) {
      throw new Error('Invalid transaction hash format');
    }
    
    console.log('Verifying credential with hash:', txHash);
    
    // First try to get the transaction from our API (cached verification)
    try {
      const response = await fetch(`/api/credentials/verify/${txHash}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('API verification failed, falling back to direct blockchain check');
    }
    
    // If API verification fails, check directly on the blockchain
    const tx = await server.transactions().transaction(txHash).call();
    
    if (!tx) {
      throw new Error('Transaction not found on Stellar testnet');
    }
    
    console.log('Transaction found:', tx);
    
    // Get additional transaction details
    const operations = await server.operations().forTransaction(txHash).call();
    console.log('Transaction operations:', operations);
    
    // Extract credential data from operations and memo
    let credentialData = null;
    
    // Find manage data operation containing credential info
    for (const op of operations.records) {
      if (op.type === 'manage_data' && op.name && op.name.startsWith('CREDENTIAL_')) {
        try {
          // Convert Buffer to string if necessary before parsing JSON
          const valueStr = typeof op.value === 'string' ? op.value : 
                           Buffer.isBuffer(op.value) ? op.value.toString() : 
                           JSON.stringify(op.value);
          
          credentialData = JSON.parse(valueStr);
          break;
        } catch (e) {
          console.warn('Could not parse credential data');
        }
      }
    }
    
    // If no credential data found in operations, try memo
    if (!credentialData && tx.memo_type === 'text' && tx.memo) {
      try {
        const memoStr = tx.memo.toString();
        const memoData = JSON.parse(memoStr);
        credentialData = {
          id: memoData.cred,
          type: memoData.type,
          version: memoData.ver,
          issueDate: tx.created_at
        };
      } catch (e) {
        // If parsing fails, use raw memo text
        credentialData = {
          rawData: tx.memo,
          issueDate: tx.created_at
        };
      }
    }
    
    // If still no credential data, use basic transaction info
    if (!credentialData) {
      credentialData = {
        transactionId: tx.id,
        issueDate: tx.created_at,
        note: 'Limited credential data available'
      };
    }
    
    return {
      verified: true,
      transactionId: tx.id,
      created_at: tx.created_at,
      credentialData,
      stellarExpertUrl: `https://stellar.expert/explorer/testnet/tx/${tx.id}`,
      operations: operations.records
    };
  } catch (error) {
    console.error('Failed to verify credential:', error);
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error('Transaction not found on Stellar testnet. The hash may be incorrect or the transaction may not have been confirmed yet.');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to verify credential');
  }
};

// Get the Stellar Expert link for a transaction hash
export const getStellarExpertLink = (txHash: string): string => {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
};

// Get the Stellar Expert link for our contract
export const getContractLink = (): string => {
  return `https://stellar.expert/explorer/testnet/account/${CONTRACT_ID}`;
};

// Get account details and balance
export const getAccountDetails = async (publicKey: string): Promise<any> => {
  try {
    const account = await server.loadAccount(publicKey);
    
    // Get native XLM balance
    const xlmBalance = account.balances.find((balance: any) => 
      balance.asset_type === 'native'
    );
    
    // Get EduChain token balances (credentials)
    const credentialTokens = account.balances.filter((balance: any) => 
      balance.asset_type !== 'native' && 
      balance.asset_code && 
      balance.asset_code.startsWith('EDU')
    );
    
    return {
      publicKey: account.account_id,
      sequence: account.sequence,
      xlmBalance: xlmBalance ? xlmBalance.balance : '0',
      credentialCount: credentialTokens.length,
      credentialTokens
    };
  } catch (error) {
    console.error('Failed to get account details:', error);
    throw new Error('Failed to get account details from Stellar');
  }
};
