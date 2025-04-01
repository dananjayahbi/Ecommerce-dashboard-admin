'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Card } from 'antd';

const ProfilePage = () => {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
            <img 
              src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'User'}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{session?.user?.name || 'User'}</h2>
            <p className="text-gray-600 mb-4">{session?.user?.email || 'No email available'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Account Details</h3>
                <p className="text-sm text-gray-600">Role: Administrator</p>
                <p className="text-sm text-gray-600">Member since: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="border p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Preferences</h3>
                <p className="text-sm text-gray-600">Language: English</p>
                <p className="text-sm text-gray-600">Timezone: UTC</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage; 