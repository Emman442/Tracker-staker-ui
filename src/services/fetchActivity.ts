export interface Activity {
    user: string;
    action: string;
    amount: number;
    lock_time?: string;
    timestamp: number,
    transaction: string;
}

export const fetchActivity = async (publicKey: string, tokenSymbol: string): Promise<Activity[]> => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/activity/${publicKey}?tokenSymbol=${tokenSymbol}`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
};
