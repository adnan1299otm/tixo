
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/Navigation';
import Home from './pages/Home';
import Reels from './pages/Reels';
import { ChatList, ChatDetail } from './pages/Messages';
import Create from './pages/Create';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';

const App = () => {
  return (
    <HashRouter>
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/messages" element={<ChatList />} />
          <Route path="/messages/:id" element={<ChatDetail />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/accounts/edit" element={<EditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
