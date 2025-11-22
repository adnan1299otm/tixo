
export interface User {
  _id: string;
  id?: string; // Frontend alias
  name: string;
  email: string;
  handle: string;
  avatar: string;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  _id: string;
  id?: string; // Frontend alias
  user: User;
  content: string;
  image?: string;
  likes: string[] | any; // Flexible for number or array
  comments: Comment[] | any; // Flexible for number or array
  reposts: number;
  createdAt: string;
  timestamp?: string; // Frontend display
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Reel {
  _id: string;
  id?: string;
  user: User;
  videoUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
}

export interface Message {
  _id: string;
  id?: string;
  chatId?: string;
  sender: User; 
  senderId?: string; // Frontend simplified
  text?: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice';
  createdAt: string;
  timestamp?: string; // Display time
  readBy?: string[];
  
  // Frontend specific
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  reactions?: { emoji: string; count: number }[];
  duration?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Chat {
  _id: string;
  id?: string;
  participants: User[];
  lastMessage?: Message | any;
  unreadCount?: number;
  isGroup?: boolean;
  name?: string;
  updatedAt: string;
  
  // Frontend enrichments
  user?: User;
  isBot?: boolean;
}

export interface Notification {
  _id: string;
  id?: string;
  recipient?: string;
  sender?: User;
  user?: User; // Alias
  type: 'like' | 'comment' | 'follow' | 'system';
  text: string;
  link?: string;
  read: boolean;
  createdAt?: string;
  timestamp?: string;
}
