'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
import {FaXTwitter} from "react-icons/fa6"

const SupaLogo = () => (
    <svg width="100" height="40" viewBox="0 0 125 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.416 47.328L0 20.016L11.76 17.568L29.136 38.88L41.328 0L52.848 2.448L23.424 47.328H23.416Z" fill="hsl(var(--primary))"/>
        <path d="M124.992 22.944V18.144C124.992 12.816 123.6 8.496 120.816 5.184C118.032 1.824 114.288 0.144 109.584 0.144C104.208 0.144 100.08 1.968 97.2 5.616C94.368 9.216 92.952 13.872 92.952 19.584V23.088C92.952 28.512 94.32 32.928 97.056 36.336C99.84 39.696 103.536 41.376 108.144 41.376C111.408 41.376 114.24 40.656 116.64 39.216C119.088 37.728 120.936 35.664 122.184 33.024L112.92 28.944C112.44 29.952 111.768 30.672 110.904 31.104C110.088 31.488 109.128 31.68 108.024 31.68C106.392 31.68 105.144 31.104 104.28 29.952C103.464 28.752 103.056 26.88 103.056 24.336V21.024H124.992V22.944ZM103.056 17.712V15.744C103.056 13.536 103.536 11.904 104.496 10.848C105.504 9.744 106.992 9.192 108.96 9.192C110.784 9.192 112.152 9.72 113.064 10.776C114.024 11.784 114.408 13.32 114.408 15.36V17.712H103.056Z" fill="white"/>
        <path d="M84.3813 40.608H73.2933V0.864H84.3813V40.608Z" fill="white"/>
    </svg>
)

const TelegramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground cursor-pointer">
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
);

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground cursor-pointer"><path d="M14.4 11.05c-1.27.39-2.24 1.6-2.24 3.05s.97 2.66 2.24 3.05"/><path d="m9.6 11.05c1.27.39 2.24 1.6 2.24 3.05s-.97 2.66-2.24 3.05"/><path d="M21.38 12a9.1 9.1 0 0 1-1.33 4.36l-2.8 3.98a1.23 1.23 0 0 1-1.93.18L13.8 18.5a3.8 3.8 0 0 0-3.6 0l-1.52 2.03a1.23 1.23 0 0 1-1.93-.18l-2.8-3.98A9.1 9.1 0 0 1 2.62 12 9 9 0 1 1 21.38 12Z"/></svg>
)


export function Header() {

 const { connected } = useWallet();
  return (
    <header className="sticky top-0 flex h-20 items-center gap-4 px-4 md:px-6 z-50 bg-background/80 backdrop-blur-sm">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <SupaLogo />
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Supa Labs
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Airdrop
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Scan
        </Link>
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <FaXTwitter/>
        <DiscordIcon />
        <TelegramIcon />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <WalletMultiButton
                style={{
                  background: "transparent",
                  height: "40px",
                  padding: "0 16px 0 40px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "#00E6B8",
                  border: "1px solid #00E6B8",
                }}
              />
              {connected ? (
                <span className="left-0 absolute"></span>
              ) : (
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#00E6B8] pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
