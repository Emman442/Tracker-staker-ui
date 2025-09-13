import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

export const getMintInfo = async () => {
    const connection = new Connection("https://cassandra-bq5oqs-fast-mainnet.helius-rpc.com/");
    const mintPubkey = new PublicKey("ehipS3kn9GUSnEMgtB9RxCNBVfH5gTNRVxNtqFTBAGS");
    const mintInfo = await getMint(connection, mintPubkey);
    console.log("Decimals:", mintInfo.decimals);


    return mintInfo.decimals
};