import { Activity, fetchActivity } from "@/services/fetchActivity";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";


export function useFetchActivity(publicKey?: PublicKey | null, tokenSymbol?: string) {
    const pubkeyString = publicKey ? publicKey.toString() : undefined;

    const { data, isLoading, error } = useQuery<Activity[]>({
        queryKey: ["activity", pubkeyString, tokenSymbol],
        queryFn: () => fetchActivity(pubkeyString!, tokenSymbol!),
        staleTime: 1000 * 60,
        enabled: !!pubkeyString && !!tokenSymbol, // will only run when both exist
    });

    return { data, isLoading, error };
}
