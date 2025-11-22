
import React, { useState } from 'react';
import { Avatar, GradientButton } from '../components/UIComponents';
import { CURRENT_USER } from '../constants';
import { Image as ImageIcon, Video, Globe, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafetyService } from '../services/SafetyService';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'post' | 'reel'>('post');
  const [privacy, setPrivacy] = useState('Everyone');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePost = () => {
    const safetyCheck = SafetyService.checkContent(text);
    if (!safetyCheck.isSafe) {
      setError(safetyCheck.reason || 'Unsafe content detected.');
      return;
    }
    
    alert('Safe content published successfully! ✅');
    setText('');
    setError(null);
    navigate('/');
  };

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
           <button onClick={() => navigate(-1)} className="text-gray-500"><X size={24} /></button>
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
          <Avatar src={CURRENT_USER.avatar} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900">{CURRENT_USER.name}</h3>
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

        {activeTab === 'post' ? (
          <div className="mt-4">
             <div className="h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
               <ImageIcon size={32} className="mb-2" />
               <span className="text-sm font-medium">Add Photos</span>
             </div>
          </div>
        ) : (
          <div className="mt-4">
             <div className="h-64 bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
               <Video size={40} className="mb-2 z-10" />
               <span className="text-sm font-medium z-10">Upload Video</span>
             </div>
          </div>
        )}

        <div className="fixed bottom-24 left-4 right-4">
          <GradientButton 
            fullWidth 
            onClick={handlePost}
            children={activeTab === 'post' ? 'Post Now' : 'Share Reel'}
          />
        </div>
      </div>
    </div>
  );
}
