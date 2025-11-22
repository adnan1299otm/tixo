import React, { useState, useRef } from 'react';
import { Message, User } from '../../../types';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Check, CheckCheck, FileText, Play, Pause, Reply, Copy, Trash2, Forward, Smile } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  isMe: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  onReply: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  sender, 
  isMe, 
  isFirstInGroup, 
  isLastInGroup,
  onReply
}) => {
  const controls = useAnimation();
  const [showActions, setShowActions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // --- Swipe to Reply Logic ---
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 50) {
      onReply(message);
    }
    controls.start({ x: 0 });
  };

  // --- Long Press Logic ---
  const handleLongPress = (e: React.PointerEvent) => {
    e.preventDefault();
    setShowActions(true);
  };

  // --- Styles ---
  // Telegram-like shapes
  const roundedTopLeft = isFirstInGroup && !isMe ? 'rounded-tl-none' : 'rounded-tl-2xl';
  const roundedTopRight = isFirstInGroup && isMe ? 'rounded-tr-none' : 'rounded-tr-2xl';
  const roundedBottomLeft = isLastInGroup && !isMe ? 'rounded-bl-none' : 'rounded-bl-2xl';
  const roundedBottomRight = isLastInGroup && isMe ? 'rounded-br-none' : 'rounded-br-2xl';

  const bubbleColor = isMe 
    ? 'bg-[#2AABEE] text-white shadow-sm' 
    : 'bg-white text-gray-900 shadow-sm border border-gray-100';

  const maxWidth = 'max-w-[80%] sm:max-w-[70%]';

  // --- Content Rendering ---
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative overflow-hidden rounded-lg mb-1">
            <img src={message.mediaUrl} alt="Attachment" className="w-full h-auto max-h-[300px] object-cover" />
            <div className="absolute inset-0 bg-black/5" />
          </div>
        );
      case 'voice':
        return (
          <div className="flex items-center gap-3 pr-4 py-1 min-w-[200px]">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isMe ? 'bg-white text-[#2AABEE]' : 'bg-[#2AABEE] text-white'}`}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="flex-1 flex flex-col gap-1">
               {/* Waveform simulation */}
               <div className="flex items-center gap-0.5 h-6">
                 {[...Array(15)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     animate={{ height: isPlaying ? [8, 16, 8] : 8 }}
                     transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05, ease: "easeInOut" }}
                     className={`w-1 rounded-full ${isMe ? 'bg-white/70' : 'bg-[#2AABEE]/40'}`}
                     style={{ height: Math.random() * 16 + 4 }} 
                   />
                 ))}
               </div>
               <span className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-500'}`}>{message.duration}</span>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3 pr-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-[#2AABEE]/10'}`}>
              <FileText size={24} className={isMe ? 'text-white' : 'text-[#2AABEE]'} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate max-w-[150px]">{message.fileName}</span>
              <span className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-500'}`}>{message.fileSize}</span>
            </div>
          </div>
        );
      default:
        return <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>;
    }
  };

  return (
    <div className="relative w-full mb-1 group">
      {/* Reply Action Area (Hidden offscreen) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-0">
         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
           <Reply size={16} />
         </div>
      </div>

      <motion.div 
        drag="x" 
        dragConstraints={{ left: 0, right: 50 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} relative z-10`}
      >
        {/* Avatar for incoming group start */}
        {!isMe && (
          <div className="w-8 mr-2 flex-shrink-0 flex items-end">
             {isLastInGroup ? <img src={sender.avatar} className="w-8 h-8 rounded-full" alt="" /> : <div className="w-8" />}
          </div>
        )}

        {/* Message Bubble */}
        <motion.div
          ref={bubbleRef}
          onPointerDown={(e) => {
             // Simple long press simulation
             const timer = setTimeout(() => handleLongPress(e), 500);
             bubbleRef.current?.addEventListener('pointerup', () => clearTimeout(timer), { once: true });
             bubbleRef.current?.addEventListener('pointermove', () => clearTimeout(timer), { once: true });
          }}
          className={`
            relative px-3 py-2 min-w-[80px] 
            ${bubbleColor} ${maxWidth}
            ${roundedTopLeft} ${roundedTopRight} ${roundedBottomLeft} ${roundedBottomRight}
          `}
        >
          {/* Sender Name (Group Chat) */}
          {!isMe && isFirstInGroup && (
            <div className="text-xs font-bold text-[#2AABEE] mb-1 cursor-pointer hover:underline">
              {sender.name}
            </div>
          )}

          {/* Reply Quote Context */}
          {message.replyTo && (
            <div className={`mb-2 rounded pl-2 border-l-2 ${isMe ? 'border-white/50 bg-black/10' : 'border-[#2AABEE] bg-[#2AABEE]/10'} py-1 cursor-pointer`}>
              <div className={`text-xs font-bold ${isMe ? 'text-white' : 'text-[#2AABEE]'}`}>{message.replyTo.senderId === 'me' ? 'You' : sender.name}</div>
              <div className={`text-xs truncate ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
                {message.replyTo.type === 'text' ? message.replyTo.text : 'Attachment'}
              </div>
            </div>
          )}

          {renderContent()}

          {/* Footer: Time & Status */}
          <div className={`flex items-center justify-end gap-1 mt-1 select-none`}>
            <span className={`text-[11px] ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
              {message.timestamp}
            </span>
            {isMe && (
              <div className={message.status === 'read' ? 'text-[#addfff]' : 'text-white/70'}>
                {message.status === 'read' ? <CheckCheck size={14} strokeWidth={2.5} /> : <Check size={14} strokeWidth={2.5} />}
              </div>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
             <div className="absolute -bottom-3 right-4 flex -space-x-1">
                {message.reactions.map((r, i) => (
                   <div key={i} className="bg-white border border-gray-200 shadow-sm rounded-full px-1.5 py-0.5 text-[10px] flex items-center z-20">
                      {r.emoji} <span className="ml-0.5 font-bold text-gray-600">{r.count}</span>
                   </div>
                ))}
             </div>
          )}
        </motion.div>
      </motion.div>

      {/* Popover Menu (Simplified for Demo) */}
      {showActions && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowActions(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-full ${isMe ? 'right-0' : 'left-10'} mt-2 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-1 w-48 flex flex-col overflow-hidden origin-top-right`}
          >
             <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg mb-1">
                {['👍','❤️','😂','😮','😢'].map(emoji => (
                  <button key={emoji} className="hover:scale-125 transition-transform">{emoji}</button>
                ))}
             </div>
             <button onClick={() => { onReply(message); setShowActions(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
               <Reply size={16} /> Reply
             </button>
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
               <Copy size={16} /> Copy
             </button>
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
               <Forward size={16} /> Forward
             </button>
             {isMe && (
               <button className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600">
                 <Trash2 size={16} /> Delete
               </button>
             )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;