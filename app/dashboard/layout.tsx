'use client';

import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu as MenuIcon } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

const { Header, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

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