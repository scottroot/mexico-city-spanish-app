'use client'

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Trophy, 
  BookOpen, 
  HelpCircle, 
  BookText, 
  Wrench, 
  Menu, 
  X, 
  Crown,
  User,
  LogOut,
  ChevronRight,
  Gamepad2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "../ui/LanguageToggle";
import ClickAway from "../ClickAway";
import GoProButton from "./buttons/go-pro";
import { useBilling } from "../../hooks/useBilling";

interface MainNavigationProps {
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

export default function MainNavigation({ user }: MainNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { hasAccess } = useBilling();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    { id: 'games', title: t('navigation.games'), url: "/games", icon: Gamepad2 },
    { id: 'progress', title: t('navigation.progress'), url: "/progress", icon: Trophy },
    { id: 'verbs', title: t('navigation.verbs'), url: "/verbs", icon: BookOpen },
    { id: 'quiz', title: t('navigation.quiz'), url: "/quiz", icon: HelpCircle },
    { id: 'stories', title: t('navigation.stories'), url: "/stories", icon: BookText },
    { id: 'tools', title: t('navigation.tools'), url: "/tools", icon: Wrench },
  ];

  // Bottom app bar items for mobile (4 items max)
  const bottomNavItems: NavigationItem[] = [
    { id: 'games', title: t('navigation.games'), url: "/games", icon: Gamepad2 },
    { id: 'stories', title: t('navigation.stories'), url: "/stories", icon: BookText },
    { id: 'verbs', title: t('navigation.verbs'), url: "/verbs", icon: BookOpen },
  ];

  const handleSignOut = async (): Promise<void> => {
    const formData = new FormData();
    const response = await fetch('/auth/signout', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      router.push('/auth/login');
    }
  };


  const UserAccountButton = () => {
    if (!user) {
      return (
        <Link
          href="/auth/login"
          className="flex items-center justify-center xl:justify-start gap-3 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 w-full"
          title={t('navigation.login')}
        >
          <User className="w-4 h-4" />
          <span className="hidden xl:block text-sm font-medium">{t('navigation.login')}</span>
        </Link>
      );
    }

    return (
      <ClickAway
        onClickAway={() => setShowUserMenu(false)}
        containerClass="relative w-full"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowUserMenu(!showUserMenu);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center justify-center xl:justify-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
          title={user.email}
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="hidden xl:block flex-1 text-left">
            <p className="text-sm font-medium text-gray-800">{t('navigation.user')}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <ChevronRight className={`hidden xl:block w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]"
            >
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('navigation.logout')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </ClickAway>
    );
  };

  const SidebarContent = () => (
    <div className="flex grow flex-col overflow-y-auto bg-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-center xl:justify-start xl:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="hidden xl:block">
            <h1 className="text-lg font-bold text-gray-800">{t('app.title')}</h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-2 xl:px-3">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          <li>
            <ul role="list" className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className={`group flex items-center justify-center xl:justify-start gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      pathname === item.url
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={item.title} // Tooltip for icon-only mode
                  >
                    <item.icon
                      className={`w-5 h-5 xl:w-6 xl:h-8 shrink-0 ${
                        pathname === item.url
                          ? 'text-blue-600'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    <span className="hidden xl:block">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Language Toggle */}
          <li className="mt-auto px-1 xl:px-3 pb-2">
            <div className="flex justify-center xl:justify-start">
              <LanguageToggle />
            </div>
          </li>

          {/* Billing Section */}
          <li className="px-1 xl:px-3 pb-2">
            <div className="flex justify-center xl:justify-start">
              <GoProButton user={user} />
            </div>
          </li>

          {/* User Account - Avatar with text on xl+ */}
          <li className="px-1 xl:px-3 pb-4">
            <div className="flex justify-center xl:justify-start">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(true)}
                  className="flex items-center justify-center xl:justify-start gap-3 w-auto xl:w-full hover:bg-gray-50 xl:hover:bg-transparent rounded-lg xl:rounded-full p-2 xl:p-0 transition-all duration-200"
                  title={user.email}
                >
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                  </div>
                  <span className="hidden xl:block text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center xl:justify-start gap-3 w-auto xl:w-full hover:bg-gray-50 xl:hover:bg-transparent rounded-lg xl:rounded-full p-2 xl:p-0 transition-all duration-200"
                  title="Login"
                >
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200">
                    <User className="w-4 h-4 xl:w-5 xl:h-5 text-gray-600" />
                  </div>
                  <span className="hidden xl:block text-sm font-medium text-gray-700">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900/80 z-40 xl:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 xl:hidden"
            >
              <div className="relative flex h-full w-full flex-col bg-white shadow-xl">
                {/* Close button */}
                <div className="absolute top-0 right-0 -mr-12 flex pt-4">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop - icons only from md, icons+text from xl */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-16 xl:w-64 md:flex-col">
        <div className="flex grow flex-col bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile header - only show on screens smaller than md */}
      {/* <div className="md:hidden fixed w-full top-0 z-40 flex h-10 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8"> */}
      {/* <div className="md:hidden w-full top-0 z-40 flex h-10 items-center gap-x-6 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8"> */}
      <div id="mobile-header" className="sticky top-0 z-40 md:hidden h-10 flex shrink-0 items-center gap-x-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white shadow-sm">
        <Link href="/">
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
            {t('app.title')}
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user && (
            <div className="flex items-center gap-2">
              <GoProButton user={user} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom app bar for mobile */}
      <div className="md:hidden h-16 fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                pathname === item.url
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.title}</span>
            </Link>
          ))}
          
          {/* User Account - 4th item */}
          <div className="flex flex-col items-center justify-center p-2">
            {user ? (
              <button
                onClick={() => setShowUserMenu(true)}
                className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Account</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Account Modal - All Screen Sizes */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setShowUserMenu(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-w-[90vw] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Account</h2>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {user && (
                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="text-center py-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{t('navigation.user')}</h3>
                      <p className="text-gray-500 mt-1 text-sm">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-3">
                      <Link
                        href="/account"
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Account Settings</p>
                          <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                        </div>
                      </Link>

                      <Link
                        href="/pro"
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{hasAccess ? 'Manage Subscription' : 'Go Pro'}</p>
                          <p className="text-sm text-gray-500">{hasAccess ? 'Update your subscription' : 'Unlock premium features'}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t('navigation.logout')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
