'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Admin Panel</h1>
          <p className="text-muted-foreground">
            This page is not part of the required design.
          </p>
        </div>
      </main>
    </div>
  );
}
