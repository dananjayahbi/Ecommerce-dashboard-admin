'use client';

import React, { useState } from 'react';
import { Layout, Button, Dropdown } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Menu as MenuIcon, LogOut, User } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

const { Header, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const profileMenuItems = [
    {
      key: 'profile',
      label: (
        <div 
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" 
          onClick={() => router.push('/dashboard/profile')}
        >
          <User size={16} className="mr-2" />
          Profile
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div 
          className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100" 
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar component with collapsed prop */}
      <Sidebar collapsed={collapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
          <Button
            type="text"
            icon={<MenuIcon />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', height: 40 }}
          />
          {session?.user && (
            <div className="flex items-center">
              <span className="mr-4">Welcome, {session.user.name}</span>
              <Dropdown 
                menu={{ items: profileMenuItems }} 
                placement="bottomRight" 
                trigger={['click']}
                arrow
              >
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <img 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name || 'User'}&background=random`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Dropdown>
            </div>
          )}
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 