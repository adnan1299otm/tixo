import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '../../types';
import { MOCK_MESSAGES, CURRENT_USER } from '../../constants';
import MessageBubble from './bubbles/MessageBubble';
import { ArrowLeft, Phone, Video, MoreVertical, Paperclip, Mic, Send, Smile, X, Bot, Reply, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SafetyService } from '../../services/SafetyService';

interface ChatScreenProps {
  chat: Chat;
}

export default function ChatScreen({ chat }: ChatScreenProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES[chat.id] || []);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const check = SafetyService.checkContent(inputText);
    if (!check.isSafe) {
      setSafetyWarning(check.reason || 'Unsafe content.');
      setTimeout(() => setSafetyWarning(null), 4000);
      return; 
    }
    
    const newMessage: Message = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      senderId: 'me',
      sender: CURRENT_USER,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      isMe: true,
      type: 'text',
      status: 'sent',
      replyTo: replyingTo || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);

    if (chat.isBot) {
       setTimeout(() => {
         setMessages(prev => [...prev, {
            _id: (Date.now() + 1).toString(),
            id: (Date.now() + 1).toString(),
            senderId: 'bot',
            sender: chat.user!, 
            text: 'I am processing your request... 🤖',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString(),
            isMe: false,
            type: 'text',
            status: 'read'
         }]);
       }, 1000);
    }
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: `url("https://web.telegram.org/img/bg_0.png")`, backgroundSize: 'cover' }}>
      </div>

      <div className="z-30 bg-white/80 backdrop-blur-md shadow-sm px-3 py-2 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-1 flex-1 overflow-hidden">
          <button onClick={() => router.back()} className="p-2 -ml-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-1 flex-1 overflow-hidden cursor-pointer">
             <img src={chat.user?.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-200" alt="Avatar" />
             <div className="flex flex-col justify-center">
                <h3 className="font-bold text-[15px] leading-tight flex items-center gap-1 text-gray-900">
                  {chat.user?.name}
                  {chat.isBot && <Bot size={14} className="text-[#2AABEE]" />}
                </h3>
                <span className={`text-[12px] truncate ${chat.user?.isOnline ? 'text-[#2AABEE]' : 'text-gray-500'}`}>
                  {chat.isBot ? 'bot' : (chat.user?.isOnline ? 'Online' : chat.user?.lastSeen || 'Last seen recently')}
                </span>
             </div>
          </div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
           <button className="p-2 hover:bg-gray-100 rounded-full"><Phone size={22} /></button>
           <button className="p-2 hover:bg-gray-100 rounded-full"><Video size={22} /></button>
           <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={22} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 z-10 flex flex-col gap-0.5 pb-2">
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          
          const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || (parseInt(msg.id || '0') - parseInt(prevMsg.id || '0') > 60000); 
          const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
          const showDate = index === 0 || (index === 4); 

          return (
            <React.Fragment key={msg.id || msg._id}>
              {showDate && (
                <div className="flex justify-center my-4 sticky top-2 z-20">
                  <span className="bg-black/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {index === 0 ? 'Today' : 'Yesterday'}
                  </span>
                </div>
              )}
              <MessageBubble 
                message={msg}
                sender={msg.isMe ? CURRENT_USER : chat.user!}
                isMe={msg.isMe || false}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                onReply={handleReply}
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {safetyWarning && (
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 20, opacity: 0 }}
             className="absolute bottom-20 left-4 right-4 z-50 bg-red-600 text-white p-3 rounded-xl shadow-lg flex items-center gap-3"
           >
             <AlertTriangle size={20} className="text-white" />
             <span className="text-sm font-medium">{safetyWarning}</span>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="z-30 bg-white pb-safe">
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between px-4 pt-2 pb-1 bg-white border-t border-gray-100"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Reply size={24} className="text-[#2AABEE]" />
                <div className="border-l-2 border-[#2AABEE] pl-2 flex flex-col">
                  <span className="text-[#2AABEE] text-xs font-bold">Replying to {replyingTo.isMe ? 'You' : chat.user?.name}</span>
                  <span className="text-gray-500 text-xs truncate max-w-[200px]">{replyingTo.text || 'Attachment'}</span>
                </div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 p-2 sm:p-3 border-t border-gray-100 bg-white/80 backdrop-blur-xl">
           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
             <Paperclip size={24} />
           </button>
           
           <div className="flex-1 bg-gray-100 rounded-2xl flex items-center min-h-[44px] px-3 py-1 relative">
              <input 
                ref={inputRef}
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setSafetyWarning(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message" 
                className="flex-1 bg-transparent outline-none text-[16px] leading-5 text-gray-900 placeholder-gray-400"
              />
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <Smile size={24} />
              </button>
           </div>

           <button 
             onClick={inputText ? handleSend : undefined}
             className={`
               w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200
               ${inputText ? 'bg-[#2AABEE] text-white scale-100' : 'bg-[#2AABEE] text-white scale-100 hover:brightness-110'}
             `}
           >
             {inputText ? <Send size={20} className="ml-0.5" /> : <Mic size={24} />}
           </button>
        </div>
      </div>
    </div>
  );
}