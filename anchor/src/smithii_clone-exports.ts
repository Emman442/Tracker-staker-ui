// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SeekerProgramIDL from '../target/idl/seeker_program.json'
import type { SeekerProgram } from '../target/types/seeker_program'

// Re-export the generated IDL and type
export { SeekerProgram, SeekerProgramIDL }

// The programId is imported from the program IDL.
export const SEEKER_PROGRAM_ID= new PublicKey(SeekerProgramIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getSeekerProgram(provider: AnchorProvider, address?: PublicKey) {
    return new Program({ ...SeekerProgramIDL, address: address ? address.toBase58() : SeekerProgramIDL.address } as SeekerProgram, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getSeekerProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Counter program on devnet and testnet.
            return new PublicKey("Cd6YWBPWpFTv6TCNHvLTUrLhESmT3JrfpFbcgNY4HNdw")
        case 'mainnet-beta':
        default:
            return SEEKER_PROGRAM_ID
    }
}