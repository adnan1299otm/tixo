
"use client";
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { POSTS } from '@/constants';
import { Avatar } from '@/components/UIComponents';
import { Settings, Grid, UserCheck, Link as LinkIcon, Loader2 } from 'lucide-react';
import { TopHeader } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  if (!user) {
    return <div className="p-10 text-center">Please login</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopHeader 
        title={user.handle} 
        actions={<button onClick={() => router.push('/settings')} className="text-gray-700"><Settings size={22} /></button>} 
      />

      {/* Profile Header */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="relative">
             <Avatar src={user.avatar} size="xl" />
          </div>
          
          <div className="flex-1 flex justify-around items-center ml-4 mt-2">
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900">0</span>
              <span className="text-xs text-gray-500">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900">{user.followers?.length || 0}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900">{user.following?.length || 0}</span>
              <span className="text-xs text-gray-500">Following</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
           <h1 className="font-bold text-gray-900 text-lg flex items-center gap-1">
             {user.name} 
             {user.isVerified && <span className="text-blue-500 text-sm">✓</span>}
           </h1>
           <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{user.bio || "No bio yet."}</p>
           
           {user.website && (
             <div className="flex items-center gap-1 text-indigo-600 text-sm mt-1 font-medium hover:underline">
               <LinkIcon size={14} />
               <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website.replace(/^https?:\/\//, '')}</a>
             </div>
           )}
        </div>

        <div className="flex gap-2 mt-4">
           <button 
             onClick={() => router.push('/accounts/edit')}
             className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors"
           >
             Edit Profile
           </button>
           <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors">
             Share Profile
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mt-6 border-t border-gray-100 sticky top-[57px] bg-white z-10">
         <button 
           onClick={() => setActiveTab('posts')}
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'posts' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
         >
           <Grid size={24} />
         </button>
         <button 
           onClick={() => setActiveTab('saved')}
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
         >
           <UserCheck size={24} />
         </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {POSTS.map((post) => (
           <div key={post.id} className="aspect-square bg-gray-100 relative group overflow-hidden">
             {post.image ? (
               <img src={post.image} className="w-full h-full object-cover" alt="Post" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-indigo-50 p-2 text-xs text-center text-indigo-900 font-medium">
                 {post.content.substring(0, 30)}...
               </div>
             )}
           </div>
        ))}
      </div>
    </div>
  );
}
