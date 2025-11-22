
import React from 'react';
import { Reel } from '../../types';
import { Avatar } from '../UIComponents';
import { DiamondLike, HexComment, PrismShare, WaveformIcon } from './ReelIcons';
import { motion } from 'framer-motion';
import { MoreVertical, Plus } from 'lucide-react';

export const ReelOverlay = ({ reel }: { reel: Reel }) => {
  const [liked, setLiked] = React.useState(false);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5 z-20 pointer-events-none">
      
      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-start pointer-events-auto">
        <h2 className="text-white font-black text-xl tracking-tighter drop-shadow-lg">REELS</h2>
        
        {/* Unique Music Pill - Top Right */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full">
          <div className="flex items-center gap-0.5 h-3">
             {[1,2,3,4].map(i => (
               <motion.div 
                 key={i}
                 animate={{ height: [4, 12, 4] }}
                 transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                 className="w-0.5 bg-cyan-400 rounded-full"
               />
             ))}
          </div>
          <span className="text-xs font-bold text-cyan-100 tracking-wide uppercase">Neon Vibes</span>
        </div>
      </div>

      {/* --- BOTTOM AREA --- */}
      <div className="flex items-end justify-between w-full mb-4 pointer-events-auto">
        
        {/* Custom Floating Info Card (Bottom Left) */}
        <div className="w-[70%] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500"></div>
           
           <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar src={reel.user.avatar} size="md" />
                <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5 border border-black">
                   <Plus size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm leading-none mb-1">{reel.user.name}</h3>
                 <p className="text-cyan-200 text-xs font-medium">{reel.user.handle}</p>
              </div>
           </div>
           
           <p className="text-white/90 text-sm leading-snug font-light">
             {reel.caption} <span className="text-cyan-300 font-bold">#tixo</span>
           </p>
        </div>

        {/* Horizontal Action Dock (Bottom Right) */}
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-lg">
           <button 
             onClick={() => setLiked(!liked)}
             className="flex flex-col items-center gap-1 group"
           >
             <DiamondLike filled={liked} className={`w-8 h-8 transition-all ${liked ? 'text-pink-500 scale-110' : 'text-white group-active:scale-90'}`} />
           </button>

           <button className="flex flex-col items-center gap-1 group">
             <HexComment className="w-8 h-8 text-white transition-all group-active:scale-90" />
           </button>

           <button className="flex flex-col items-center gap-1 group">
             <PrismShare className="w-8 h-8 text-white transition-all group-active:scale-90" />
           </button>
           
           <div className="w-px h-8 bg-white/20 mx-1"></div>

           <button className="flex flex-col items-center gap-1">
             <MoreVertical className="w-6 h-6 text-white/70" />
           </button>
        </div>

      </div>
    </div>
  );
};
