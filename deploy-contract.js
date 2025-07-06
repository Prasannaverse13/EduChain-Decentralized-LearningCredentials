import * as StellarSdk from 'stellar-sdk';

// Set up the Stellar testnet server
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Use our new keypair
const contractKeypair = StellarSdk.Keypair.fromSecret('SC3JTVNCUY7RA4YG6KHJ27NHYJHRRRAXKHDZ66E5HD3QK7VHS2NZFAX6');
const contractId = contractKeypair.publicKey();

async function setupContract() {
  try {
    console.log(`Setting up contract with ID: ${contractId}`);
    
    // Load the contract account
    const contractAccount = await server.loadAccount(contractId);
    
    // Deploy a Stellar Asset Contract (SAC) for credential issuance
    // This is a simplified representation for the hackathon
    const contractDeployTx = new StellarSdk.TransactionBuilder(contractAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_CONTRACT_TYPE',
        value: 'CREDENTIAL_ISSUER'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_CONTRACT_VERSION',
        value: '1.0.0'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_PLATFORM',
        value: 'EduChain'
      }))
      .addOperation(StellarSdk.Operation.manageData({
        name: 'EDUCHAIN_PURPOSE',
        value: 'Educational credentials for decentralized learning'
      }))
      .setTimeout(30)
      .build();
    
    contractDeployTx.sign(contractKeypair);
    const result = await server.submitTransaction(contractDeployTx);
    
    console.log(`Contract deployed successfully!`);
    console.log(`Transaction Hash: ${result.hash}`);
    console.log(`View contract on Stellar Expert: https://stellar.expert/explorer/testnet/account/${contractId}`);
    console.log(`View transaction: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    
    return {
      contractId,
      transactionHash: result.hash,
      stellarExpertUrl: `https://stellar.expert/explorer/testnet/account/${contractId}`
    };
  } catch (error) {
    console.error('Failed to setup credential contract:', error);
    throw error;
  }
}

// Execute the function
setupContract().catch(console.error);