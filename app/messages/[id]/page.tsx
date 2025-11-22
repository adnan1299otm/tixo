"use client";
import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { Message } from '@/types';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  // Fetch messages with 1s polling for pseudo-realtime
  const { data: messages, mutate } = useSWR<Message[]>(`/api/messages/${params.id}`, fetcher, {
    refreshInterval: 2000
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    
    try {
      await axios.post(`/api/messages/${params.id}`, { text });
      setText("");
      mutate(); // Refresh immediately
    } catch (error) {
      console.error("Failed to send");
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] relative">
      <div className="z-30 bg-white/80 backdrop-blur-md shadow-sm px-3 py-2 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <h3 className="font-bold text-gray-900">Chat</h3>
        </div>
        <MoreVertical size={22} className="text-gray-500" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
         {messages?.map((msg) => {
           const isMe = msg.sender._id === session.user.id; // Assuming id injected into session
           return (
             <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${isMe ? 'bg-[#2AABEE] text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none shadow-sm'}`}>
                   <p className="text-sm">{msg.text}</p>
                   <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                     {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                </div>
             </div>
           );
         })}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
         <input 
           value={text}
           onChange={(e) => setText(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           placeholder="Type a message..." 
           className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
         />
         <button onClick={handleSend} className="bg-[#2AABEE] text-white p-2 rounded-full">
           <Send size={20} />
         </button>
      </div>
    </div>
  );
}