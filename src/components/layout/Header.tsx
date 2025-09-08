'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { TrackerLogo } from '@/components/icons/TrackerLogo';

export function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-primary/20 bg-background/50 backdrop-blur-sm px-4 md:px-6 z-50 font-code">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <TrackerLogo className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl text-primary tracking-widest">SEEKER</span>
      </Link>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className='border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold'>
        <Wallet className="mr-2 h-4 w-4" />
        CONNECT_WALLET
      </Button>
    </header>
  );
}
