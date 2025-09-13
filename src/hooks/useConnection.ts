"use client";
import { useMemo } from "react";
import { Connection } from "@solana/web3.js";

const HELIUS_RPC = "https://cassandra-bq5oqs-fast-mainnet.helius-rpc.com/";

export function useSolanaConnection() {
    const connection = useMemo(() => {
        return new Connection(HELIUS_RPC, "confirmed");
    }, []);

    return connection;
}
