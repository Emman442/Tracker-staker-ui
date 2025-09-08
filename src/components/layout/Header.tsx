'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackerLogo } from '@/components/icons/TrackerLogo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-50">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <TrackerLogo className="h-8 w-8 text-primary" />
        <span className="font-headline text-xl">TrackerStake</span>
      </Link>
      <nav className="flex flex-1 items-center gap-4 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            'transition-colors hover:text-foreground',
            pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/admin"
          className={cn(
            'transition-colors hover:text-foreground',
            pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          Admin
        </Link>
      </nav>
      <Button variant="outline" size="sm">Connect Wallet</Button>
    </header>
  );
}
