"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import { Post } from '@/types';
import { Avatar, UserIdentity } from '@/components/UIComponents';
import { Heart, MessageCircle, Share2, Repeat, MoreHorizontal, Bell, Search, X, Loader2 } from 'lucide-react';
import { TopHeader } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes?.length || 0);

  const toggleLike = () => {
    // Optimistic update (would also call API here)
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4"
    >
      <div className="flex justify-between items-start mb-3">
        <UserIdentity user={post.user} subText={new Date(post.createdAt).toLocaleDateString()} />
        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
      
      {post.image && (
        <div className="mb-4 rounded-2xl overflow-hidden shadow-sm">
          <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
        </div>
      )}

      <div className="flex items-center justify-between text-gray-500 px-2">
        <button 
          onClick={toggleLike}
          className={`flex items-center gap-2 group ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
        >
          <Heart size={22} className={`transition-transform group-active:scale-75 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>
        
        <button className="flex items-center gap-2 hover:text-blue-500 group">
          <MessageCircle size={22} className="group-active:scale-90 transition-transform" />
          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
        </button>
        
        <button className="flex items-center gap-2 hover:text-green-500 group">
          <Repeat size={22} className="group-active:rotate-180 transition-transform duration-300" />
          <span className="text-sm font-medium">{post.reposts}</span>
        </button>
        
        <button className="hover:text-indigo-500">
          <Share2 size={22} />
        </button>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: posts, error, isLoading } = useSWR<Post[]>('/api/posts', fetcher);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (status === "unauthenticated") {
     return (
        <div className="min-h-screen flex items-center justify-center flex-col p-6">
           <h1 className="text-3xl font-black text-primary mb-4">Tixo.</h1>
           <p className="text-gray-500 mb-6 text-center">Join the next-gen social platform.</p>
           <button onClick={() => signIn()} className="bg-primary text-white px-6 py-3 rounded-full font-bold w-full shadow-xl">
              Login / Sign Up
           </button>
        </div>
     )
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <TopHeader 
        logo 
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full shadow-sm transition-all duration-300 ${
                isSearchOpen 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 rotate-90' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={2.5} />}
            </button>
            <button 
              onClick={() => router.push('/notifications')} 
              className="relative p-2 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        } 
      />
      
      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden bg-white/50 backdrop-blur-sm"
          >
            <div className="py-3">
               <div className="relative group">
                 <input 
                   type="text" 
                   placeholder="Search users, hashtags..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-4 pr-10 py-3 bg-white rounded-2xl shadow-sm border border-indigo-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                   autoFocus
                 />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      <div className="px-4 mt-4 space-y-2">
        {isLoading && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>}
        {posts?.length === 0 && <div className="text-center py-10 text-gray-500">No posts yet. Be the first!</div>}
        {posts?.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}