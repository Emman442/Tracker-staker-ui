import { FaCoins } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";

export default function SocialIcons() {
      const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("ehipS3kn9GUSnEMgtB9RxCNBVfH5gTNRVxNtqFTBAGS");
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };
  return (
    <div className="flex items-center space-x-1 bg-[#011b14] border border-[#00ff9c33] rounded-lg px-3 py-1.5">
      <div
        className="relative group"
        onClick={() =>
          window.open(
            "https://dexscreener.com/solana/gcty8z4vs8gdhor6t2ecv2tqsmrcztzlpnb8kvkkwpgf",
            "_blank"
          )
        }
      >
        <div className="p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200">
          <Image
            src="https://pbs.twimg.com/profile_images/1462287879565201409/5UYqudVs_400x400.jpg"
            alt="Dex Screener"
            width={20}
            height={20}
            className="rounded-full"
          />
        </div>
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#00ff9c33] shadow-lg">
          View on DexScreener
        </span>
      </div>

      <div className="relative group" onClick={handleCopy}>
        <div className="p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200">
          <FaCoins className="text-yellow-400 text-xl" />
        </div>
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#00ff9c33] shadow-lg">
          Copy Token Address
        </span>
      </div>

      <div
        className="relative group"
        onClick={() =>
          window.open(
            "https://rugcheck.xyz/tokens/ehipS3kn9GUSnEMgtB9RxCNBVfH5gTNRVxNtqFTBAGS",
            "_blank"
          )
        }
      >
        <div className="p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200">
          <Image
            src="https://pbs.twimg.com/profile_images/1659290984293756928/VeEo1KYz_400x400.jpg"
            alt="Rug Check"
            width={20}
            height={20}
            className="rounded-full"
          />
        </div>
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#00ff9c33] shadow-lg">
          Rug Check Analysis
        </span>
      </div>

      <div
        className="relative group"
        onClick={() => window.open("https://t.me/SeekerTracker", "_blank")}
      >
        <div className="p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200">
          <Image
            src="https://pbs.twimg.com/profile_images/1183117696730390529/LRDASku7_400x400.jpg"
            width={20}
            height={20}
            className="rounded-full"
            alt="Telegram"
          />
        </div>
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#00ff9c33] shadow-lg">
          Join Telegram
        </span>
      </div>

      {/* X (Twitter) */}
      <div
        className="relative group"
        onClick={() => window.open("https://x.com", "_blank")}
      >
        <div className="p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200">
          <Image
            src="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
            width={20}
            height={20}
            className="rounded-full"
            alt="Twitter"
          />
        </div>
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#00ff9c33] shadow-lg">
          Follow on X
        </span>
      </div>
    </div>
  );
}
