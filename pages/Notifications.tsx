
"use client";
import React from 'react';
import { NOTIFICATIONS } from '../constants';
import { Avatar } from '../components/UIComponents';
import { TopHeader } from '../components/Navigation';
import { Heart, MessageCircle, UserPlus, Info, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getIcon = (type: string) => {
  switch(type) {
    case 'like': return <div className="p-1.5 bg-pink-500 rounded-full text-white"><Heart size={12} fill="white" /></div>;
    case 'comment': return <div className="p-1.5 bg-blue-500 rounded-full text-white"><MessageCircle size={12} fill="white" /></div>;
    case 'follow': return <div className="p-1.5 bg-indigo-500 rounded-full text-white"><UserPlus size={12} /></div>;
    default: return <div className="p-1.5 bg-gray-500 rounded-full text-white"><Info size={12} /></div>;
  }
};

export default function Notifications() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white pb-20">
       <TopHeader 
        title="Notifications" 
        actions={<button className="text-sm text-indigo-600 font-semibold">Mark all read</button>}
        logo={false}
      />
       <button 
         onClick={() => router.back()} 
         className="absolute top-3 left-4 z-50 p-1 bg-gray-100 rounded-full md:hidden"
       >
         <ArrowLeft size={20} />
       </button>
       
       <div className="mt-2">
         <h3 className="px-4 py-2 text-sm font-bold text-gray-900 bg-gray-50">Today</h3>
         {NOTIFICATIONS.map(notif => (
           <div key={notif.id} className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
             <div className="relative">
               {notif.user ? (
                 <Avatar src={notif.user.avatar} size="md" />
               ) : (
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">T</div>
               )}
               <div className="absolute -bottom-1 -right-1 border-2 border-white rounded-full">
                 {getIcon(notif.type)}
               </div>
             </div>
             <div className="flex-1">
               <p className="text-sm text-gray-800">
                 <span className="font-bold">{notif.user?.name || 'System'}</span> {notif.text}
               </p>
               <span className="text-xs text-gray-400 mt-1 block">{notif.timestamp}</span>
             </div>
             {notif.type === 'follow' ? (
               <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-200">
                 Follow Back
               </button>
             ) : notif.user && (
               <img src={`https://picsum.photos/seed/${notif.id}/100/100`} className="w-10 h-10 rounded-lg object-cover" alt="Post preview" />
             )}
           </div>
         ))}
       </div>
    </div>
  );
}
