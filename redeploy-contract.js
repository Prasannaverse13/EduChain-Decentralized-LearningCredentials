import * as StellarSdk from 'stellar-sdk';

// Set up the Stellar testnet server
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

async function deployNewContract() {
  try {
    // Create a new keypair for the contract
    const contractKeypair = StellarSdk.Keypair.random();
    const contractId = contractKeypair.publicKey();
    const contractSecret = contractKeypair.secret();
    
    console.log(`Creating new contract with ID: ${contractId}`);
    console.log(`Contract Secret (for reference): ${contractSecret}`);
    
    // Fund the new account using friendbot
    console.log('Funding account with Stellar Friendbot...');
    const friendbotResponse = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(contractId)}`);
    if (!friendbotResponse.ok) {
      throw new Error('Failed to fund account with friendbot');
    }
    
    // Wait a moment for the account to be created
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Load the contract account
    const contractAccount = await server.loadAccount(contractId);
    
    // Deploy the EduChain credential contract with metadata
    const contractDeployTx = new StellarSdk.TransactionBuilder(contractAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_TYPE',
        value: 'CREDENTIAL_ISSUER'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_VERSION',
        value: '2.0.0'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_PLATFORM',
        value: 'EduChain_Stellar_Hackathon'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_PURPOSE',
        value: 'Decentralized_Educational_Credentials'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_FEATURES',
        value: 'Course_Enrollment_Credential_Verification'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_NETWORK',
        value: 'Stellar_Testnet'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_TIMESTAMP',
        value: new Date().toISOString()
      }))
      .setTimeout(30)
      .build();
    
    contractDeployTx.sign(contractKeypair);
    const result = await server.submitTransaction(contractDeployTx);
    
    console.log('\n🎉 Contract deployed successfully!');
    console.log('='.repeat(60));
    console.log(`📍 Contract ID: ${contractId}`);
    console.log(`🔗 Transaction Hash: ${result.hash}`);
    console.log(`🌐 Stellar Expert (Contract): https://stellar.expert/explorer/testnet/account/${contractId}`);
    console.log(`🌐 Stellar Expert (Transaction): https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    console.log('='.repeat(60));
    
    return {
      contractId,
      transactionHash: result.hash,
      contractSecret,
      stellarExpertContract: `https://stellar.expert/explorer/testnet/account/${contractId}`,
      stellarExpertTx: `https://stellar.expert/explorer/testnet/tx/${result.hash}`
    };
  } catch (error) {
    console.error('❌ Failed to deploy credential contract:', error);
    throw error;
  }
}

// Execute the deployment
deployNewContract()
  .then(result => {
    console.log('\n✅ Deployment completed successfully!');
    console.log('Contract is ready for use in the EduChain platform.');
  })
  .catch(error => {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  });