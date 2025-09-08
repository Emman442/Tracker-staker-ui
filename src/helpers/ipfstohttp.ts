export function ipfsToHttp(ipfsUri: string, gateway = "https://ipfs.io/ipfs/") {
    return ipfsUri.replace("ipfs://", gateway);
}