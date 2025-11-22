import React from 'react';
import { User } from '../types';
import { BadgeCheck } from 'lucide-react';

export const Avatar = ({ src, size = 'md', hasStory = false }: { src: string, size?: 'sm' | 'md' | 'lg' | 'xl', hasStory?: boolean }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative ${hasStory ? 'p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full' : ''}`}>
      <img 
        src={src} 
        alt="Avatar" 
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white`} 
      />
    </div>
  );
};

export const GradientButton = ({ children, onClick, className = '', fullWidth = false }: { children?: React.ReactNode, onClick?: () => void | Promise<void>, className?: string, fullWidth?: boolean }) => (
  <button
    onClick={onClick as any}
    className={`
      bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 
      text-white font-medium py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-200
      ${fullWidth ? 'w-full' : ''} ${className}
    `}
  >
    {children}
  </button>
);

export const UserIdentity = ({ user, subText }: { user: User, subText?: string }) => (
  <div className="flex items-center gap-3">
    <Avatar src={user.avatar} size="md" />
    <div>
      <div className="flex items-center gap-1">
        <span className="font-semibold text-gray-900">{user.name}</span>
        {user.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />}
      </div>
      <div className="text-xs text-gray-500">{subText || user.handle}</div>
    </div>
  </div>
);