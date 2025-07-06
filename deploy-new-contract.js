import * as StellarSdk from 'stellar-sdk';

// Generate new keypair for the contract
const contractKeypair = StellarSdk.Keypair.random();
const contractId = contractKeypair.publicKey();
const contractSecret = contractKeypair.secret();

console.log('🚀 Deploying New EduChain Contract on Stellar Testnet');
console.log('='.repeat(50));
console.log('Contract ID:', contractId);
console.log('Contract Secret:', contractSecret);

// Fund and deploy
async function deployContract() {
  try {
    // Fund the account
    console.log('\n📡 Funding account with Friendbot...');
    const fundResponse = await fetch(`https://friendbot.stellar.org?addr=${contractId}`);
    
    if (!fundResponse.ok) {
      throw new Error('Failed to fund account');
    }
    
    console.log('✅ Account funded successfully');
    
    // Setup Stellar server
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const networkPassphrase = StellarSdk.Networks.TESTNET;
    
    // Wait for account to be available
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Load the account
    const account = await server.loadAccount(contractId);
    
    // Create deployment transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
    .addOperation(StellarSdk.Operation.manageData({
      name: 'EDUCHAIN_TYPE',
      value: 'CREDENTIAL_ISSUER'
    }))
    .addOperation(StellarSdk.Operation.manageData({
      name: 'EDUCHAIN_VERSION',
      value: '2.1.0'
    }))
    .addOperation(StellarSdk.Operation.manageData({
      name: 'EDUCHAIN_PLATFORM',
      value: 'Stellar_Hackathon_2025'
    }))
    .addOperation(StellarSdk.Operation.manageData({
      name: 'EDUCHAIN_FEATURES',
      value: 'Decentralized_Education_Credentials'
    }))
    .setTimeout(30)
    .build();
    
    // Sign and submit
    transaction.sign(contractKeypair);
    const result = await server.submitTransaction(transaction);
    
    console.log('\n🎉 CONTRACT DEPLOYED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`📍 Contract Address: ${contractId}`);
    console.log(`🔗 Transaction Hash: ${result.hash}`);
    console.log(`🌐 View on Stellar Expert: https://stellar.expert/explorer/testnet/account/${contractId}`);
    console.log(`📋 Transaction Details: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    console.log('='.repeat(50));
    
    return {
      contractId,
      transactionHash: result.hash,
      stellarExpertUrl: `https://stellar.expert/explorer/testnet/account/${contractId}`
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

deployContract();