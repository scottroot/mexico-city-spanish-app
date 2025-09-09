'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Trophy, User, BookOpen, LogOut, HelpCircle, BookText, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./ui/LanguageToggle";
import ClickAway from "./ClickAway";

interface TopNavigationProps {
  user: {
    email: string;
  } | null;
}

interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TopNavigation({ user }: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  // const userMenuRef = useRef<HTMLDivElement>(null);

  const navigationItems: NavigationItem[] = [
    { id: 'games', title: t('navigation.games'), url: "/", icon: Home },
    { id: 'progress', title: t('navigation.progress'), url: "/progress", icon: Trophy },
    { id: 'verbs', title: t('navigation.verbs'), url: "/verbs", icon: BookOpen },
    { id: 'quiz', title: t('navigation.quiz'), url: "/quiz", icon: HelpCircle },
    { id: 'stories', title: t('navigation.stories'), url: "/stories", icon: BookText },
    { id: 'tools', title: t('navigation.tools'), url: "/tools", icon: Wrench },
  ];

  const handleSignOut = async (): Promise<void> => {
    // Use the server-side signout route
    const formData = new FormData();
    const response = await fetch('/auth/signout', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      router.push('/auth/login');
    }
  };

  // // Close user menu when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
  //       setShowUserMenu(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const UserAccountButton = () => {
    if (!user) {
      return (
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{t('navigation.login')}</span>
        </Link>
      );
    }

    return (
      <ClickAway
        onClickAway={() => setShowUserMenu(false)}
        containerClass="relative"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowUserMenu(!showUserMenu);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
        
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-orange-100 py-2 z-[60]">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">{t('navigation.user')}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('navigation.logout')}
            </button>
          </div>
        )}
      </ClickAway>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="relative hidden z-50 md:block bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{t('app.title')}</h1>
                <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
              </div>
            </Link>
            
            {/* Top Navigation Menu */}
            <nav className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === item.url
                      ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
            
            {/* Right Side - Language Toggle and User Menu */}
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <UserAccountButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-orange-100 relative z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{t('app.title')}</h1>
                <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <UserAccountButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
