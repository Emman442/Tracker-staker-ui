import { FaCoins } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";

export default function SocialIcons() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "ehipS3kn9GUSnEMgtB9RxCNBVfH5gTNRVxNtqFTBAGS"
      );
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const socialItems = [
    {
      onClick: () =>
        window.open(
          "https://dexscreener.com/solana/gcty8z4vs8gdhor6t2ecv2tqsmrcztzlpnb8kvkkwpgf",
          "_blank"
        ),
      icon: (
        <Image
          src="https://pbs.twimg.com/profile_images/1462287879565201409/5UYqudVs_400x400.jpg"
          alt="Dex Screener"
          width={18}
          height={18}
          className="rounded-full"
        />
      ),
      tooltip: "View on DexScreener",
      shortTooltip: "DexScreener",
    },
    {
      onClick: handleCopy,
      icon: (
        <Image
          src="/coin.png"
          alt="copy"
          width={18}
          height={18}
          className="rounded-full"
        />
      ),
      tooltip: "Copy Addressr",
      shortTooltip: "Copy",
    },

    {
      onClick: () =>
        window.open(
          "https://rugcheck.xyz/tokens/ehipS3kn9GUSnEMgtB9RxCNBVfH5gTNRVxNtqFTBAGS",
          "_blank"
        ),
      icon: (
        <Image
          src="https://pbs.twimg.com/profile_images/1659290984293756928/VeEo1KYz_400x400.jpg"
          alt="Rug Check"
          width={18}
          height={18}
          className="rounded-full"
        />
      ),
      tooltip: "Rug Check Analysis",
      shortTooltip: "Rug Check",
    },
    {
      onClick: () => window.open("https://t.me/SeekerTracker", "_blank"),
      icon: (
        <Image
          src="https://pbs.twimg.com/profile_images/1183117696730390529/LRDASku7_400x400.jpg"
          width={18}
          height={18}
          className="rounded-full"
          alt="Telegram"
        />
      ),
      tooltip: "Join Telegram",
      shortTooltip: "Telegram",
    },
    {
      onClick: () => window.open("https://x.com", "_blank"),
      icon: (
        <Image
          src="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
          width={18}
          height={18}
          className="rounded-full"
          alt="Twitter"
        />
      ),
      tooltip: "Follow on X",
      shortTooltip: "X",
    },
  ];

  return (
    <div className="flex mt-2 pl-5 items-center space-x-1 sm:space-x-1 bg-[#011b14] border border-[#00ff9c33] rounded-lg px-1.5 sm:px-3 py-1.5">
      {socialItems.map((item, index) => (
        <div key={index} className="relative group" onClick={item.onClick}>
          <div className="p-1 sm:p-1 rounded-md border border-[#00ff9c33] bg-[#001a13] transition transform hover:-translate-y-1 hover:scale-105 duration-200 cursor-pointer">
            {item.icon}
          </div>
          {/* Desktop tooltip */}
          <span className="hidden sm:inline-block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition w-max border border-[#00ff9c33] shadow-lg z-10">
            {item.tooltip}
          </span>
          {/* Mobile tooltip */}
          <span className="sm:hidden inline-block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#001a13] text-[#00ff9c] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition w-max border border-[#00ff9c33] shadow-lg z-10">
            {item.shortTooltip}
          </span>
        </div>
      ))}
    </div>
  );
}
