
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import EditProfileForm from '../components/profile/EditProfileForm';

export default function EditProfile() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b border-gray-100 flex items-center gap-4 md:hidden">
        <button onClick={() => router.back()} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Edit Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto md:py-10 md:px-4">
        <div className="bg-white md:border md:border-gray-200 md:rounded-xl md:flex overflow-hidden min-h-[600px]">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 border-r border-gray-200">
            <div className="flex flex-col">
              <button className="px-6 py-4 text-left font-semibold text-black border-l-2 border-black bg-gray-50">
                Edit profile
              </button>
              <button className="px-6 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                Change password
              </button>
              <button className="px-6 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                Push Notifications
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-0 md:p-10">
            <EditProfileForm />
          </main>
        </div>
      </div>
    </div>
  );
}
