'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, BookOpen, HelpCircle, BookText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TopNavigation from "./TopNavigation";

export default function Layout({ children, currentPageName, user }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'games', title: t('navigation.games'), url: "/", icon: Home },
    { id: 'progress', title: t('navigation.progress'), url: "/progress", icon: Trophy },
    { id: 'verbs', title: t('navigation.verbs'), url: "/verbs", icon: BookOpen },
    { id: 'quiz', title: t('navigation.quiz'), url: "/quiz", icon: HelpCircle },
    // { id: 'stories', title: t('navigation.stories'), url: "/stories", icon: BookText },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-white to-teal-50 flex flex-col">
      <style>
        {`
          :root {
            --primary-coral: #FF6B6B;
            --primary-teal: #4ECDC4;
            --accent-yellow: #FFE66D;
            --accent-purple: #A8E6CF;
            --text-dark: #2C3E50;
            --text-light: #7F8C8D;
          }
        `}
      </style>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col flex-1">
        {/* Top Navigation Bar */}
        <TopNavigation user={user} />
        
        {/* Page Header */}
        {/* <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-3 relative z-40">
          <h2 className="text-xl font-semibold text-gray-800">
            {navigationItems.find(item => {
              if (item.url === "/") {
                return pathname === "/";
              }
              return pathname.startsWith(item.url);
            })?.title || 'Dashboard'}
          </h2>
        </div> */}
        
        {/* Main Content Area - Full Width */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col flex-1">
        {/* Mobile Header */}
        <TopNavigation user={user} />

        {/* Mobile Main Content */}
        <main className="flex-1 pb-16">
          {children}
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-orange-100">
          <div className="flex justify-around py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  pathname === item.url
                    ? 'text-orange-500'
                    : 'text-gray-500 hover:text-orange-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}