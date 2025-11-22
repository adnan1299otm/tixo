
"use client";
import React, { useState } from 'react';
import { Avatar, GradientButton } from '@/components/UIComponents';
import { Image as ImageIcon, Video, Globe, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function Create() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'post' | 'reel'>('post');
  const [privacy, setPrivacy] = useState('Everyone');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text) {
      setError("Please write something.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/posts', {
         content: text,
         image: imageUrl || undefined
      });
      alert('Post published! ✅');
      setText('');
      setImageUrl('');
      setError(null);
      router.push('/');
    } catch (err) {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="p-10 text-center">Please login first</div>;

  return (
    <div className="min-h-screen bg-white relative">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-16 left-4 right-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl z-50 flex items-start gap-3 shadow-lg"
          >
            <AlertTriangle className="shrink-0" size={20} />
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button onClick={() => setError(null)}><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
         <div className="flex justify-between items-center px-4 py-3">
           <button onClick={() => router.back()} className="text-gray-500"><X size={24} /></button>
           <div className="flex bg-gray-100 p-1 rounded-lg">
             <button 
               onClick={() => setActiveTab('post')}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'post' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
             >
               Post
             </button>
             <button 
               onClick={() => setActiveTab('reel')}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'reel' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
             >
               Reel
             </button>
           </div>
           <span className="w-6"></span>
         </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3 mb-4">
          <Avatar src={session.user?.image || ''} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900">{session.user?.name}</h3>
            <button className="flex items-center gap-1 text-xs text-indigo-600 font-medium border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
              <Globe size={10} /> {privacy}
            </button>
          </div>
        </div>

        <textarea 
          placeholder={activeTab === 'post' ? "What's on your mind?" : "Describe your reel..."}
          className="w-full h-32 text-lg placeholder-gray-400 focus:outline-none resize-none"
          value={text}
          onChange={(e) => { setText(e.target.value); setError(null); }}
        />

        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Image URL (Optional)" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm border border-gray-100"
          />
        </div>

        {activeTab === 'post' ? (
          <div className="mt-2">
             <div className="h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
               <ImageIcon size={24} className="mb-2" />
               <span className="text-xs font-medium">Upload Photo (Server Needed)</span>
             </div>
          </div>
        ) : (
           <div className="mt-2 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
              Video upload requires cloud storage configuration.
           </div>
        )}

        <div className="fixed bottom-24 left-4 right-4">
          <GradientButton 
            fullWidth 
            onClick={handlePost}
            className="flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (activeTab === 'post' ? 'Post Now' : 'Share Reel')}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
