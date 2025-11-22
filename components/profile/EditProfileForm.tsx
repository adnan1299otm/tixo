
"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { AvatarUploader } from './AvatarUploader';
import { GradientButton } from '@/components/UIComponents';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function EditProfileForm() {
  const { user, mutate } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    bio: '',
    website: '',
    gender: 'Prefer not to say',
    birthday: '',
    avatar: ''
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        handle: user.handle || '',
        bio: user.bio || '',
        website: user.website || '',
        gender: user.gender || 'Prefer not to say',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelected = async (file: File, previewUrl: string) => {
    // 1. Show preview immediately
    setFormData(prev => ({ ...prev, avatar: previewUrl }));
    
    // 2. In a real app, upload to Cloudinary here
    // const formData = new FormData(); formData.append('file', file);
    // const res = await axios.post('/api/upload', formData);
    // setFormData(prev => ({ ...prev, avatar: res.data.url }));
    
    // For now, we just simulate usage of the local preview or a placeholder logic
    // Note: Local blob URLs won't persist across sessions. You need a real upload API.
    console.log("File selected for upload:", file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await axios.put('/api/user/profile', formData);
      
      setMessage({ type: 'success', text: 'Profile saved.' });
      await mutate(); // Revalidate data globally
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Failed to update profile.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Feedback Toast */}
      {message && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom-5 z-50 ${message.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <AvatarUploader currentAvatar={formData.avatar} onImageSelected={handleImageSelected} />

      <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-10">
        
        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Name</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="Name"
            />
            <p className="text-xs text-gray-400 mt-2">
              Help people discover your account by using the name you're known by: either your full name, nickname, or business name.
            </p>
          </div>
        </div>

        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Username</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Username</label>
            <input 
              name="handle" 
              value={formData.handle} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="Username"
            />
          </div>
        </div>

        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Website</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Website</label>
            <input 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="http://yoursite.com"
            />
          </div>
        </div>

        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Bio</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              maxLength={150}
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.bio.length} / 150
            </div>
          </div>
        </div>

        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Gender</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Custom">Custom</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <div className="md:flex md:items-start gap-8">
          <aside className="md:w-32 pt-2 text-right hidden md:block">
            <label className="font-semibold text-gray-900">Birthday</label>
          </aside>
          <div className="flex-1">
            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Birthday</label>
            <input 
              type="date"
              name="birthday" 
              value={formData.birthday} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 md:pl-40">
          <GradientButton 
            fullWidth={false} 
            className="w-full md:w-auto px-10 flex justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
          </GradientButton>
        </div>

      </form>
    </div>
  );
}
