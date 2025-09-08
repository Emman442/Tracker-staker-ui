import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");



export async function getTokenBalance(wallet: PublicKey, mint: PublicKey) {

    const ata = await getAssociatedTokenAddress(mint, wallet);


    const accountInfo = await getAccount(connection, ata);


    const rawAmount = accountInfo.amount;


    const mintInfo = await connection.getParsedAccountInfo(mint);
    const decimals = (mintInfo.value?.data as any).parsed?.info?.decimals ?? 0;

    const amount = Number(rawAmount) / Math.pow(10, decimals);

    return amount;
}

