
import React, { useRef } from 'react';
import { Avatar } from '@/components/UIComponents';
import { Camera } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatar: string;
  onImageSelected: (file: File, previewUrl: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatar, onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL immediately for UI feedback
      const previewUrl = URL.createObjectURL(file);
      onImageSelected(file, previewUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 mb-6">
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <Avatar src={currentAvatar} size="xl" />
        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white" size={24} />
        </div>
      </div>
      
      <div>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-semibold text-[#2AABEE] hover:text-blue-600"
        >
          Change Profile Photo
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
