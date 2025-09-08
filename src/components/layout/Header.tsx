'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const UsdcIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <path d="M12.9248 7.375H10.1648V8.695H12.8048C13.2948 8.695 13.6348 8.785 13.8248 8.965C14.0148 9.145 14.1098 9.425 14.1098 9.805C14.1098 10.185 14.0148 10.465 13.8248 10.645C13.6348 10.825 13.2948 10.915 12.8048 10.915H9.68477V12.235H12.9248C13.4148 12.235 13.7548 12.325 13.9448 12.505C14.1348 12.685 14.2298 12.965 14.2298 13.345C14.2298 13.725 14.1348 14.005 13.9448 14.185C13.7548 14.365 13.4148 14.455 12.9248 14.455H10.1648V15.775H12.9248C13.8448 15.775 14.5348 15.545 14.9948 15.085C15.4548 14.625 15.6848 13.995 15.6848 13.195C15.6848 12.445 15.4648 11.835 15.0248 11.365C14.5848 10.895 13.9448 10.66 13.1048 10.66C13.9548 10.59 14.6098 10.355 15.0698 9.955C15.5298 9.555 15.7598 8.975 15.7598 8.215C15.7598 7.425 15.4948 6.795 14.9648 6.325C14.4348 5.855 13.7348 5.625 12.8648 5.625H8.70477V17.525H10.1648V16.205H12.9248C13.8448 16.205 14.5448 16.435 15.0248 16.9C15.5048 17.365 15.7448 17.995 15.7448 18.79H17.1848V7.375H12.9248Z" fill="hsl(var(--primary))"/>
    </svg>
)

export function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-white/10 bg-transparent px-4 md:px-6 z-50">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <UsdcIcon />
        <span className="font-headline text-xl text-primary">USDC</span>
      </Link>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className='border-primary text-primary hover:bg-primary/10 hover:text-primary'>
        <Wallet className="mr-2 h-4 w-4" />
        FyhZ...W9Az
      </Button>
    </header>
  );
}
