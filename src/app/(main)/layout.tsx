'use client';
import * as React from 'react';
import { DashboardFilterProvider } from '@/contexts/DashboardFilterContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <DashboardFilterProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </DashboardFilterProvider>
  );
}
