"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clapperboard, PlusSquare, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Clapperboard, path: '/reels', label: 'Reels' },
    { icon: PlusSquare, path: '/create', label: 'Create' },
    { icon: MessageCircle, path: '/messages', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  // Hide on specific pages (Chat Detail)
  if (currentPath.startsWith('/messages/') && currentPath !== '/messages') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        <div className="glass-panel mb-4 rounded-3xl shadow-2xl shadow-indigo-100/50 flex justify-between items-center px-2 py-3 bg-white/80 backdrop-blur-md">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative p-3 flex flex-col items-center justify-center w-full"
              >
                <item.icon 
                  size={26} 
                  className={`transition-all duration-300 ${active ? 'text-indigo-600 -translate-y-1' : 'text-gray-400'}`} 
                  strokeWidth={active ? 2.5 : 2}
                />
                {active && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const BottomNavNext = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentPath = pathname || '/';

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Clapperboard, path: '/reels', label: 'Reels' },
    { icon: PlusSquare, path: '/create', label: 'Create' },
    { icon: MessageCircle, path: '/messages', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  // Hide on specific pages (Chat Detail)
  if (currentPath.startsWith('/messages/') && currentPath !== '/messages') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        <div className="glass-panel mb-4 rounded-3xl shadow-2xl shadow-indigo-100/50 flex justify-between items-center px-2 py-3 bg-white/80 backdrop-blur-md">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="relative p-3 flex flex-col items-center justify-center w-full"
              >
                <item.icon 
                  size={26} 
                  className={`transition-all duration-300 ${active ? 'text-indigo-600 -translate-y-1' : 'text-gray-400'}`} 
                  strokeWidth={active ? 2.5 : 2}
                />
                {active && (
                  <motion.div 
                    layoutId="nav-indicator-next"
                    className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TopHeader = ({ 
  title, 
  logo = false, 
  actions 
}: { 
  title?: string, 
  logo?: boolean, 
  actions?: React.ReactNode 
}) => {
  return (
    <div className="sticky top-0 z-40 glass-panel px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md">
      {logo ? (
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
          Tixo.
        </h1>
      ) : (
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      )}
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </div>
  );
};