"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
import Image from "next/image";
import SocialIcons from "../ui/socialIcons";

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 flex h-16 md:h-20 items-center gap-4 px-3 md:px-6 z-50 bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <Image
        src="/seeker-tracker.png"
        alt="seeker staker logo"
        width={35}
        height={35}
        className="rounded-full md:w-[45px] md:h-[45px]"
      />

      {/* Title */}
      <nav className="flex items-center">
        <Link
          href="#"
          className="text-[#00FF9C] transition-colors hover:text-foreground text-base md:text-lg lg:text-xl font-semibold"
        >
          {"Tracker Stacker".toUpperCase()}
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Social icons + Wallet */}
      {/* <div className="flex items-center gap-2"> */}
        {/* <SocialIcons /> */}

        <WalletMultiButton
          style={{
            background: "transparent",
            height: "36px",
            fontSize: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#00E6B8",
            border: "1px solid #00E6B8",
          }}
        />
      {/* </div> */}
    </header>
  );
}
