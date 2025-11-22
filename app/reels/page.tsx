"use client";
import React from 'react';
import { REELS } from '@/constants';
import { ReelOverlay } from '@/components/reels/ReelOverlay';
import { motion } from 'framer-motion';

const ReelItem: React.FC<{ reel: typeof REELS[0] }> = ({ reel }) => {
  return (
    <div className="relative w-full h-screen bg-black snap-center shrink-0 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img 
          src={reel.videoUrl} 
          alt="Reel Content" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      <ReelOverlay reel={reel} />
    </div>
  );
};

export default function Reels() {
  return (
    <div className="h-screen w-full bg-[#0f0f0f] overflow-y-scroll snap-y snap-mandatory no-scrollbar relative">
      {REELS.map(reel => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
      {REELS.map((reel) => (
        <ReelItem key={`${reel.id}-copy`} reel={{...reel, id: `${reel.id}-copy`}} />
      ))}
    </div>
  );
}