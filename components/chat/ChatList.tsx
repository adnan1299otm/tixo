import React from 'react';
import { CHATS } from '../../constants';
import { useRouter } from 'next/navigation';
import { Search, PenSquare, Bot, Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatList() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white relative">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg pt-3 pb-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <button className="text-[#2AABEE] font-medium text-base">Edit</button>
          <h1 className="text-[17px] font-semibold text-black">Chats</h1>
          <button className="text-[#2AABEE]"><PenSquare size={24} /></button>
        </div>

        <div className="relative group">
           <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-400 pointer-events-none">
             <Search size={16} />
           </div>
           <input 
             type="text" 
             placeholder="Search for messages or users" 
             className="w-full bg-gray-100 text-gray-900 rounded-xl py-2 pl-9 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/50 placeholder-gray-500 transition-all text-center focus:text-left focus:pl-9 group-hover:text-left group-hover:pl-9"
           />
        </div>
      </div>

      <div className="pb-24">
        {CHATS.map((chat) => (
          <motion.div 
            key={chat.id}
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={() => router.push(`/messages/${chat.id}`)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
          >
            <div className="relative shrink-0">
               <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover bg-gray-200" alt={chat.user.name} />
               {chat.user.isOnline && (
                 <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
               )}
            </div>

            <div className="flex-1 border-b border-gray-100/80 py-2.5 min-w-0 group-last:border-0">
               <div className="flex justify-between items-center mb-0.5">
                 <h3 className="font-semibold text-[16px] text-gray-900 flex items-center gap-1">
                   {chat.user.name}
                   {chat.isBot && <Bot size={14} className="text-[#2AABEE]" />}
                   {chat.user.isVerified && !chat.isBot && <div className="w-3 h-3 bg-[#2AABEE] rounded-full flex items-center justify-center text-[8px] text-white"><Check size={8} strokeWidth={4} /></div>}
                 </h3>
                 
                 <div className="flex items-center gap-1">
                   {chat.lastMessage.status === 'read' && chat.lastMessage.isMe && <CheckCheck size={14} className="text-[#2AABEE]" />}
                   {chat.lastMessage.status !== 'read' && chat.lastMessage.isMe && <Check size={14} className="text-gray-400" />}
                   <span className={`text-[13px] ${chat.unreadCount > 0 ? 'text-[#2AABEE]' : 'text-gray-400'}`}>
                     {chat.lastMessage.timestamp}
                   </span>
                 </div>
               </div>

               <div className="flex justify-between items-center">
                 <p className="text-[15px] text-gray-500 truncate pr-4 flex-1">
                   {chat.lastMessage.isMe && <span className="text-black">You: </span>}
                   {chat.lastMessage.type === 'image' && <span className="text-[#2AABEE]">📷 Photo</span>}
                   {chat.lastMessage.type === 'voice' && <span className="text-[#2AABEE]">🎤 Voice Message</span>}
                   {chat.lastMessage.type === 'file' && <span className="text-[#2AABEE]">📄 File</span>}
                   {chat.lastMessage.type === 'text' && chat.lastMessage.text}
                 </p>
                 
                 {chat.unreadCount > 0 && (
                   <div className="min-w-[20px] h-5 px-1.5 bg-[#2AABEE] rounded-full flex items-center justify-center">
                     <span className="text-white text-[12px] font-bold">{chat.unreadCount}</span>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-20 right-4 z-30">
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="w-14 h-14 bg-[#2AABEE] rounded-full shadow-xl shadow-[#2AABEE]/30 flex items-center justify-center text-white"
         >
           <PenSquare size={24} />
         </motion.button>
      </div>
    </div>
  );
}