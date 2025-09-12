"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import SocialIcons from "../ui/socialIcons";
import { getMintInfo } from "@/helpers/getMintInfo";

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 flex h-20 items-center gap-4 px-4 md:px-6 z-50 bg-background/80 backdrop-blur-sm">
      <Image
        src="/seeker-tracker.png"
        alt="seeker staker logo"
        width={45}
        height={45}
        className="rounded-full"
      />

      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="text-muted-foreground text-[#00FF9C] transition-colors hover:text-foreground text-xl"
        >
          {"Seeker Staker".toUpperCase()}
        </Link>
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <SocialIcons />

        <WalletMultiButton
          style={{
            background: "transparent",
            height: "40px",
            fontSize: "14px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#00E6B8",
            border: "1px solid #00E6B8",
          }}
        />
      </div>
    </header>
  );
}
