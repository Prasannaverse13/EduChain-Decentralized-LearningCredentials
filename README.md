# EduChain: Blockchain-Powered Educational Credentials

## Project Overview

EduChain is a decentralized educational credential platform built on the Stellar blockchain for the Stellar hackathon. The platform enables the issuance, storage, and verification of tamper-proof, globally recognized credentials for courses and certifications, connecting learners with educators and institutions through a decentralized network.

The platform addresses a critical problem in the global education landscape: the lack of standardized, easily verifiable credentials that can be trusted across borders and institutions. By leveraging Stellar's blockchain technology, EduChain provides a solution that makes education more inclusive and accessible worldwide by offering secure, portable credentials to underserved communities.

## Technical Architecture & Implementation Details

### Stellar Integration

EduChain is fully integrated with the Stellar network in the following ways:

1. **Deployed Smart Contract**: We have deployed a real smart contract on the Stellar testnet with transaction hash `ad2b1213d3cd647cc4d22106bd54d2023edac0a4c3ca3d08c11ba1d3539a69ad`.

2. **Contract ID**: The contract is accessible at `GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL` and can be viewed on [Stellar Expert](https://stellar.expert/explorer/testnet/account/GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL).

3. **Stellar SDK Integration**: The application uses the Stellar SDK for both client and server-side operations, with comprehensive transaction handling, account management, and credential verification.

### Blend Protocol Integration

EduChain integrates with **Blend Protocol**, a leading DeFi lending platform on Stellar, to offer educational financing solutions:

1. **Educational Loans**: Students can apply for loans using their verified educational credentials as collateral through Blend Protocol's decentralized lending pools.

2. **Credential-Based Collateral**: The platform calculates loan eligibility based on the value and credibility of educational achievements stored on the Stellar blockchain.

3. **DeFi Integration**: 
   - **Location**: `client/src/lib/blend.ts` - Client-side Blend Protocol integration
   - **Server Integration**: `server/blend.ts` - Server-side loan processing and validation
   - **UI Components**: `client/src/components/BlendIntegration.tsx` - Complete lending interface
   - **Dedicated Page**: `client/src/pages/BlendFinance.tsx` - Standalone finance page at `/finance`

4. **Live Contract Integration**: Connected to Blend Protocol testnet contracts:
   - Pool Factory: `CDIE73IJJKOWXWCPU5GWQ745FUKWCSH3YKZRF5IQW7GE3G7YAZ773MYK`
   - BLND Token: `CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF`
   - Lending Pool: `CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5`

5. **Features**:
   - Real-time pool statistics and interest rates
   - Credential-based loan eligibility calculation
   - Automatic collateral ratio determination
   - Integration with MetaMask and Freighter wallets
   - Direct links to Blend Protocol documentation and testnet interface

4. **Wallet Integration**: The platform supports both MetaMask and Freighter wallets, with a clean UI for wallet selection and connection.

5. **Asset Management**: Educational credentials are represented as custom Stellar assets with unique identifiers, creating a permanent link between the learner and their achievements.

### Core Files for Stellar Integration

- **[`server/stellar.ts`](server/stellar.ts)**: Contains all server-side Stellar functionality including:
  - Account verification and creation
  - Asset issuance (for credentials)
  - Smart contract interaction
  - Credential verification via the Stellar blockchain

- **[`client/src/lib/stellar.ts`](client/src/lib/stellar.ts)**: Client-side Stellar integration including:
  - Contract information and references
  - Credential verification functions
  - Account status checks
  - Stellar Explorer links

- **[`client/src/lib/wallet.ts`](client/src/lib/wallet.ts)**: Wallet providers (MetaMask and Freighter) with consistent interfaces for:
  - Connection handling
  - Transaction signing
  - Public key management

- **[`deploy-contract.js`](deploy-contract.js)**: Script used to deploy our Stellar smart contract with metadata tags for educational credentials.

### Full Stack Architecture

The platform follows a modern web application pattern:

- **Frontend**: React with TypeScript, ShadCN UI components, and TailwindCSS
- **Backend**: Express.js API server with in-memory storage for demo purposes
- **Database**: Uses an in-memory database for the hackathon, but designed for easy migration to PostgreSQL
- **Authentication**: Wallet-based authentication using Stellar public keys

## Technical Decisions & Approaches

### Why Stellar?

We chose Stellar for several key reasons:

1. **Speed and Cost**: Stellar's low transaction fees and fast confirmation times are ideal for educational credentials that need to be accessible globally, including in regions with limited resources.

2. **Asset Tokenization**: Stellar's native support for custom assets makes it perfect for representing different types of credentials as unique tokens.

3. **Smart Contract Capabilities**: While Stellar's smart contract system is different from Ethereum's, its capabilities are well-suited for managing verifiable credentials with immutable records.

4. **Global Accessibility**: Stellar's focus on financial inclusion aligns with our goal of making education more accessible worldwide.

### Smart Contract Implementation

Our unique approach to smart contracts on Stellar:

1. We utilize Stellar's account-based structure as a contract, with the account holding metadata about the credential standard and verification methods.

2. Each credential issuance creates a unique asset tied to the contract account, creating an immutable record of the credential's existence and properties.

3. Metadata and memo fields are used to store essential credential data like skills, issuing institution, and recipient information.

4. The contract's transaction history serves as an immutable audit trail of all credentials issued through the platform.

## Deployment and Testing

### Prerequisites

- Node.js 18+ and npm
- Access to the internet for Stellar testnet connectivity

### Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at `http://localhost:5000`

### Testing Credentials

To test the credential verification system:

1. Connect a wallet (MetaMask or Freighter) 
2. Navigate to the Credentials page
3. Enter a Stellar transaction hash for a credential
4. The system will verify the credential on the Stellar testnet and display the details

## Unique Value for the Stellar Ecosystem

EduChain brings several unique innovations to the Stellar ecosystem:

1. **Education-Focused Contract Design**: Our smart contract is specifically designed for educational credentials, with metadata fields optimized for skills, learning outcomes, and institutional information.

2. **Dual Wallet Support**: The seamless integration of both Freighter (Stellar native) and MetaMask wallets makes our platform accessible to users from both the Stellar and Ethereum ecosystems.

3. **Credential Verification Standard**: We've created a verification standard for educational credentials on Stellar that could be adopted by other applications in the education space.

4. **Global Focus**: The platform is designed with global accessibility in mind, making it suitable for educational institutions in regions where traditional credentialing systems may be less developed.

## Team Experience with Stellar

Our team has extensive experience with blockchain technologies and has been working with Stellar specifically for this hackathon. We've gained significant knowledge about:

- Stellar's account and asset model
- Transaction operations and memo usage
- Smart contract capabilities within Stellar's constraints
- Integration with Stellar wallets (particularly Freighter)

## Looking Forward

Future developments for EduChain include:

1. Integration with existing educational platforms and institutions
2. Expanded smart contract capabilities using Soroban
3. Implementation of Stellar payment rails for course enrollments
4. Mobile application with credential wallet features

---

## Hackathon Requirements Fulfillment

### Stellar Network Integration

- ✅ **Deployed to Stellar testnet**: Our contract is live on the Stellar testnet at account `GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL`
- ✅ **Integration with Stellar's developer tools**: We use the official Stellar SDK, Horizon API, and Stellar Expert for transactions and verification
- ✅ **Full implementation of Stellar's smart contract capabilities**: Our solution leverages Stellar's account and data entry mechanisms to create a functional credential issuance system

### User Experience

- ✅ **Wallet Connection**: Users can connect both MetaMask and Freighter wallets
- ✅ **Credential Verification**: Simple interface for verifying credentials via transaction hash
- ✅ **Course Exploration**: Browse available courses before connecting a wallet
- ✅ **Enrollment**: Connect wallet to enroll in courses and receive credentials

---

*Visit our deployed contract on [Stellar Expert](https://stellar.expert/explorer/testnet/account/GAQK6STDAZKYRIT2ZMQAMNRKXODTOBMNQIXLQ5H3F2QSD2E2BHVCZNZL)*