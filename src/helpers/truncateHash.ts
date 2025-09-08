export function truncateHash(
    hash: string | undefined | null,
    start = 3,
    end = 3
): string {
    if (!hash || typeof hash !== "string") return "";
    const len = hash.length;
    if (len <= start + end + 3) return hash; 
    const head = hash.slice(0, start);
    const tail = hash.slice(len - end);
    return `${head}...${tail}`;
}
