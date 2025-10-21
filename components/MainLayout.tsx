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
    // < //div 
      // className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50"
      // className="min-h-screen"
    // >
    <>
      <MainNavigation user={user} />
      
      {/* Main content area */}
      {/* <main className="h-[calc(100vh-40px)] md:h-screen max-md:pt-10 max-md:pb-16 md:pl-16 xl:pl-64"> */}
      {/* <div className="relative block h-auto mt-10 max-md:pt-10 max-md:pb-16 overscroll-contain overflow-y-scroll"> */}
      <main 
        // add l-padding for sidebar in MainNavigation.tsx
        className={clsx(
          "h-full min-h-screen flex flex-col max-w-full overflow-hidden",
          "max-md:pt-10", // MobileTopBar padding (h-10)
          "max-md:pb-16", // MobileBottomNav padding (h-16)
          "md:pl-[86px]", // md+ desktop sidebar padding
          "xl:pl-64"
        )}
      >
      
      {/* <main className="py-6 pb-20 md:pb-6"> */}
      {/* <main className=""> */}
          {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
            {children}
          {/* </div> */}
        </main>
      {/* </div> */}
    </>
  );
}
