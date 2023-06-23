// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();
// Exact the public and private key from the keypair
const privateKey = newPair._keypair.secretKey;

const getPublicKeyFromArgs = () => {
    const args = process.argv;
    return !!args[2] ? new PublicKey(args[2]) : null;
}

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("Connection object is:", connection);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const myWallet = Keypair.fromSecretKey(privateKey);
        const publicKey = getPublicKeyFromArgs() || new PublicKey(myWallet.publicKey);
        const walletBalance = await connection.getBalance(
            publicKey
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);

    }
};

const airDropSol = async () => {
    try {
        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        // Connect to the Devnet and make a wallet from privateKey
        const myWallet = Keypair.fromSecretKey(privateKey);
        const publicKey = getPublicKeyFromArgs() || new PublicKey(myWallet.publicKey);
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            0.02 * LAMPORTS_PER_SOL
        );
        await fromAirDropSignature.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

mainFunction();