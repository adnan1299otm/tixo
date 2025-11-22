
"use client";
import React, { useState } from 'react';
import { STORIES, POSTS } from '../constants';
import { Avatar, UserIdentity } from '../components/UIComponents';
import { Heart, MessageCircle, Share2, Repeat, MoreHorizontal, Bell, Search, X } from 'lucide-react';
import { TopHeader } from '../components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const StoryBubble: React.FC<{ story: typeof STORIES[0] }> = ({ story }) => (
  <div className="flex flex-col items-center space-y-1 min-w-[72px]">
    <Avatar src={story.user.avatar} size="lg" hasStory={!story.isSeen} />
    <span className="text-xs font-medium text-gray-600 truncate w-full text-center">
      {story.user.name.split(' ')[0]}
    </span>
  </div>
);

const PostCard: React.FC<{ post: typeof POSTS[0] }> = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);

  const toggleLike = () => {
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
        <UserIdentity user={post.user} subText={post.timestamp} />
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
          <span className="text-sm font-medium">{post.comments}</span>
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

const Home = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 transition-colors group-focus-within:text-indigo-600">
                   <Search size={18} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search users, hashtags..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl shadow-sm border border-indigo-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                   autoFocus
                 />
                 {searchTerm && (
                   <button 
                     onClick={() => setSearchTerm('')}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                   >
                     <X size={16} />
                   </button>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 no-scrollbar snap-x">
        {STORIES.map(story => (
          <StoryBubble key={story.id} story={story} />
        ))}
      </div>

      {/* Feed */}
      <div className="px-4 space-y-2">
        {POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
