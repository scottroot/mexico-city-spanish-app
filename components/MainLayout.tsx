'use client'

import React from 'react';
import MainNavigation from './Nav/MainNavigation';
import clsx from 'clsx';

interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    email: string;
  } | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <>
      <MainNavigation user={user} />
      
      {/* Main content area */}
      <main 
        className={clsx(
          "h-full min-h-screen flex flex-col max-w-full overscroll-none",
          "max-md:pt-10", // MobileTopBar padding (h-10)
          "max-md:pb-16", // MobileBottomNav padding (h-16)
          "md:pl-[86px]", // md+ desktop sidebar padding
          "xl:pl-64"
        )}
      >
        {children}
      </main>
    </>
  );
}
