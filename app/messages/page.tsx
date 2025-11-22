"use client";
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Search, PenSquare, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chat } from '@/types';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function MessagesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: chats, isLoading } = useSWR<Chat[]>('/api/chats', fetcher);

  if (!session) return <div className="p-10 text-center">Please login</div>;

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find((p: any) => p.email !== session.user?.email) || chat.participants[0];
  };

  return (
    <div className="min-h-screen bg-white relative pb-24">
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
             className="w-full bg-gray-100 text-gray-900 rounded-xl py-2 pl-9 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/50"
           />
        </div>
      </div>

      <div className="mt-2">
        {isLoading && <div className="text-center py-10 text-gray-400">Loading chats...</div>}
        {chats?.map((chat) => {
          const otherUser = getOtherParticipant(chat);
          return (
            <motion.div 
              key={chat._id}
              whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
              onClick={() => router.push(`/messages/${chat._id}`)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
            >
              <div className="relative shrink-0">
                 <img src={otherUser?.avatar} className="w-14 h-14 rounded-full object-cover bg-gray-200" alt={otherUser?.name} />
              </div>

              <div className="flex-1 border-b border-gray-100/80 py-2.5 min-w-0">
                 <div className="flex justify-between items-center mb-0.5">
                   <h3 className="font-semibold text-[16px] text-gray-900 flex items-center gap-1">
                     {otherUser?.name}
                   </h3>
                   <span className="text-[13px] text-gray-400">
                     {new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                 </div>

                 <div className="flex justify-between items-center">
                   <p className="text-[15px] text-gray-500 truncate pr-4 flex-1">
                     {chat.lastMessage ? (
                       chat.lastMessage.text
                     ) : (
                       <span className="italic text-gray-400">No messages yet</span>
                     )}
                   </p>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}