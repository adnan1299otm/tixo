import { User, Post, Reel, Chat, Message, Notification } from './types';

export const APP_NAME = "Tixo Social";
export const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";

export const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/reels', label: 'Reels' },
  { path: '/create', label: 'Create' },
  { path: '/messages', label: 'Chat' },
  { path: '/profile', label: 'Profile' },
];

// --- MOCK DATA FOR FRONTEND PROTOTYPING ---

export const CURRENT_USER = {
  _id: 'u1',
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  isVerified: true,
  email: 'alex@example.com'
};

export const STORIES = [
  { id: 's1', user: { ...CURRENT_USER, name: 'Sarah' }, isSeen: false },
  { id: 's2', user: { ...CURRENT_USER, name: 'Mike' }, isSeen: true },
  { id: 's3', user: { ...CURRENT_USER, name: 'Jessica' }, isSeen: false },
];

export const POSTS = [
  {
    id: 'p1',
    _id: 'p1',
    user: CURRENT_USER,
    content: 'Just launched my new portfolio! 🚀 Check it out.',
    image: 'https://picsum.photos/seed/1/600/400',
    likes: 120,
    comments: 45,
    reposts: 12,
    timestamp: '2h ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    _id: 'p2',
    user: { ...CURRENT_USER, name: 'Sarah', handle: '@sarah_design' },
    content: 'Beautiful sunset today 🌅',
    likes: 85,
    comments: 12,
    reposts: 4,
    timestamp: '4h ago',
    createdAt: new Date().toISOString()
  }
];

export const REELS = [
  {
    id: 'r1',
    _id: 'r1',
    user: CURRENT_USER,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    caption: 'Ocean vibes 🌊',
    likes: ['u2', 'u3'],
    comments: []
  }
];

export const CHATS: any[] = [
  {
    id: 'c1',
    _id: 'c1',
    user: { ...CURRENT_USER, name: 'Sarah', isOnline: true },
    unreadCount: 2,
    lastMessage: {
      text: 'Hey, are we still on for lunch?',
      timestamp: '10:30 AM',
      isMe: false,
      status: 'read',
      type: 'text'
    },
    updatedAt: new Date().toISOString(),
    participants: [CURRENT_USER]
  },
  {
    id: 'c2',
    _id: 'c2',
    user: { ...CURRENT_USER, name: 'Tixo Bot', isVerified: true },
    isBot: true,
    unreadCount: 0,
    lastMessage: {
      text: 'Welcome to Tixo! How can I help?',
      timestamp: 'Yesterday',
      isMe: false,
      status: 'read',
      type: 'text'
    },
    updatedAt: new Date().toISOString(),
    participants: [CURRENT_USER]
  }
];

export const MOCK_MESSAGES: Record<string, any[]> = {
  'c1': [
    { id: 'm1', senderId: 'u2', text: 'Hi Alex!', timestamp: '10:00 AM', isMe: false, type: 'text' },
    { id: 'm2', senderId: 'u1', text: 'Hey Sarah!', timestamp: '10:05 AM', isMe: true, type: 'text', status: 'read' },
  ]
};

export const NOTIFICATIONS = [
  {
    id: 'n1',
    _id: 'n1',
    user: { ...CURRENT_USER, name: 'Sarah' },
    type: 'like',
    text: 'liked your post',
    read: false,
    timestamp: '2m ago'
  }
];