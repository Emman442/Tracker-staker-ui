import { Activity } from "./fetchActivity";

export const addActivity = async (activity: Activity): Promise<any> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error('Failed to add activity');
    return res.json();
}