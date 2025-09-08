export function formatNumber(num: number): string {
    if (num === null || num === undefined || isNaN(num)) return "0";

    if (num >= 1_000_000_000_000) {
        return (num / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "") + "T";
    } else if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B";
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
    } else {
        return num.toString();
    }
}
