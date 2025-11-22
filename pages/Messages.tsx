import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHATS } from '../constants';
import ChatList from '../components/chat/ChatList';
import ChatScreen from '../components/chat/ChatScreen';

// Wrapper component to handle logic for extracting ID and finding the chat
const ChatDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const chat = CHATS.find(c => c.id === id);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Chat not found</h2>
        <button 
          onClick={() => navigate('/messages')}
          className="text-[#2AABEE] font-medium px-4 py-2 hover:bg-blue-50 rounded-full transition-colors"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return <ChatScreen chat={chat} />;
};

const Messages = () => {
  const { id } = useParams();
  
  if (id) {
    return <ChatDetailWrapper />;
  }

  return <ChatList />;
};

export { ChatList, ChatDetailWrapper as ChatDetail };
export default Messages;