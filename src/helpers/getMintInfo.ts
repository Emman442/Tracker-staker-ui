import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

// Network configurations
const NETWORKS = {
    mainnet: "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
};

export interface MintInfo {
    address: string;
    network: "mainnet" | "devnet" | null;
    mintAuthority: string | null;
    supply: string;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: string | null;
}

/**
 * Fetches mint information from Solana blockchain
 * Automatically detects whether the mint exists on mainnet or devnet
 * @param mintAddress - The mint address as a string
 * @returns Promise<MintInfo | null> - Mint information or null if not found
 */
export async function getMintInfo(mintAddress: string): Promise<MintInfo | null> {
    try {
        // Validate the mint address
        const mintPubkey = new PublicKey(mintAddress);

        // Try mainnet first, then devnet
        const networks: Array<keyof typeof NETWORKS> = ["mainnet", "devnet"];

        for (const network of networks) {
            try {
                const connection = new Connection(NETWORKS[network], "confirmed");

                // Fetch mint account info
                const mintInfo = await getMint(connection, mintPubkey);

                return {
                    address: mintAddress,
                    network,
                    mintAuthority: mintInfo.mintAuthority?.toString() || null,
                    supply: mintInfo.supply.toString(),
                    decimals: mintInfo.decimals,
                    isInitialized: mintInfo.isInitialized,
                    freezeAuthority: mintInfo.freezeAuthority?.toString() || null,
                };
            } catch (error) {
                // If mint doesn't exist on this network, try the next one
                continue;
            }
        }

        // Mint not found on either network
        return null;
    } catch (error) {
        console.error("Error fetching mint info:", error);
        return null;
    }
}

/**
 * Fetches mint info from a specific network
 * @param mintAddress - The mint address as a string
 * @param network - The specific network to check
 * @returns Promise<MintInfo | null>
 */
export async function getMintInfoFromNetwork(
    mintAddress: string,
    network: keyof typeof NETWORKS
): Promise<MintInfo | null> {
    try {
        const mintPubkey = new PublicKey(mintAddress);
        const connection = new Connection(NETWORKS[network], "confirmed");

        const mintInfo = await getMint(connection, mintPubkey);

        return {
            address: mintAddress,
            network,
            mintAuthority: mintInfo.mintAuthority?.toString() || null,
            supply: mintInfo.supply.toString(),
            decimals: mintInfo.decimals,
            isInitialized: mintInfo.isInitialized,
            freezeAuthority: mintInfo.freezeAuthority?.toString() || null,
        };
    } catch (error) {
        console.error(`Error fetching mint info from ${network}:`, error);
        return null;
    }
}
