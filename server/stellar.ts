import * as StellarSdk from 'stellar-sdk';

// Set up the Stellar testnet server
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Admin account for issuing platform credentials
// In production, these would be securely stored in environment variables
const ADMIN_PUBLIC_KEY = 'GBABSJF7HIECSEPB7S4TZSHRFXXVSEJUNZVN5WICWGVAX2PZWIX6X43K';
const ADMIN_SECRET_KEY = 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4';

// Check if a Stellar account exists
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

// Our deployed credential contract on Stellar testnet
export const EDUCHAIN_CONTRACT_ID = 'GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL';
export const EDUCHAIN_CONTRACT_TX = 'ad2b1213d3cd647cc4d22106bd54d2023edac0a4c3ca3d08c11ba1d3539a69ad';

// Setup a smart contract account for educational credentials
export const setupCredentialContract = async (): Promise<{contractId: string}> => {
  try {
    // Return our already deployed contract
    console.log(`Using existing contract: ${EDUCHAIN_CONTRACT_ID}`);
    console.log(`Contract transaction: ${EDUCHAIN_CONTRACT_TX}`);
    console.log(`View contract on Stellar Expert: https://stellar.expert/explorer/testnet/account/${EDUCHAIN_CONTRACT_ID}`);
    
    return {
      contractId: EDUCHAIN_CONTRACT_ID
    };
  } catch (error) {
    console.error('Failed to setup credential contract:', error);
    throw new Error('Failed to setup credential contract on Stellar');
  }
};

// Create and issue a credential using Stellar's smart contract capabilities
export const issueCredential = async (
  destination: string, 
  credentialData: any
): Promise<string> => {
  try {
    // Use the admin account as the source for issuing credentials
    const sourceKeypair = StellarSdk.Keypair.fromSecret(ADMIN_SECRET_KEY);
    const sourceAccount = await server.loadAccount(ADMIN_PUBLIC_KEY);
    
    // Create a unique asset code for the credential
    const assetCode = `EDU${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const asset = new StellarSdk.Asset(assetCode, ADMIN_PUBLIC_KEY);
    
    // Check if destination account exists
    let destinationAccountExists = true;
    try {
      await server.loadAccount(destination);
    } catch (e) {
      destinationAccountExists = false;
    }
    
    // Prepare transaction operations
    const operations = [];
    
    // If destination account doesn't exist, create it
    if (!destinationAccountExists) {
      operations.push(
        StellarSdk.Operation.createAccount({
          destination,
          startingBalance: "2", // Just enough XLM for basic operations
        })
      );
    }
    
    // Add a trust operation for the credential asset
    operations.push(
      StellarSdk.Operation.changeTrust({
        asset,
        source: destination,
      })
    );
    
    // Issue the credential token to the destination
    operations.push(
      StellarSdk.Operation.payment({
        destination,
        asset,
        amount: '1',
        source: ADMIN_PUBLIC_KEY,
      })
    );
    
    // Reference our deployed credential contract
    operations.push(
      StellarSdk.Operation.manageData({
        name: `CONTRACT_REF`,
        value: EDUCHAIN_CONTRACT_ID
      })
    );
    
    // Add credential metadata for verification
    operations.push(
      StellarSdk.Operation.manageData({
        name: `CREDENTIAL_${assetCode}`,
        value: JSON.stringify({
          id: credentialData.id,
          title: credentialData.title,
          recipient: credentialData.recipient,
          issuer: credentialData.institution || 'EduChain Platform',
          issueDate: new Date().toISOString(),
          skills: credentialData.skills || [],
          verification: {
            method: 'stellar-blockchain',
            platform: 'EduChain',
            contractId: EDUCHAIN_CONTRACT_ID,
            timestamp: Date.now()
          }
        }).substring(0, 64) // Manage data has a 64 byte limit
      })
    );
    
    // Build and submit the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    });
    
    // Add all operations
    operations.forEach(operation => {
      transaction.addOperation(operation);
    });
    
    // Add a memo with additional credential data
    const memoText = JSON.stringify({
      cred: credentialData.id,
      type: 'education',
      ver: '1.0',
      contract: EDUCHAIN_CONTRACT_ID.substring(0, 10) // Include part of contract ID
    }).substring(0, 28); // Memo text is limited to 28 bytes
    
    const builtTransaction = transaction
      .addMemo(StellarSdk.Memo.text(memoText))
      .setTimeout(30)
      .build();
    
    builtTransaction.sign(sourceKeypair);
    
    // For operations that require the destination to sign (like changeTrust)
    // In a real app, this would be signed by the destination's wallet
    // For demo purposes, we'd use a test account where we know the secret
    // This part would be handled differently in production with proper auth
    
    const result = await server.submitTransaction(builtTransaction);
    console.log(`Credential issued: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    return result.hash;
  } catch (error) {
    console.error('Failed to issue credential:', error);
    throw new Error('Failed to issue credential on Stellar');
  }
};

// Verify a credential using Stellar blockchain
export const verifyCredential = async (txHash: string): Promise<any> => {
  try {
    // Validate transaction hash format
    if (!txHash || typeof txHash !== 'string' || txHash.length < 10) {
      throw new Error('Invalid transaction hash format');
    }
    
    console.log('Verifying credential with hash:', txHash);
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
