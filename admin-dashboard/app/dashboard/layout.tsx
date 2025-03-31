'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  BarChart3,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const navItems = [
    {
      key: '/dashboard',
      icon: <BarChart3 size={18} />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '/dashboard/users',
      icon: <Users size={18} />,
      label: <Link href="/dashboard/users">Users</Link>,
    },
    {
      key: '/dashboard/products',
      icon: <ShoppingBag size={18} />,
      label: <Link href="/dashboard/products">Products</Link>,
    },
    {
      key: '/dashboard/settings',
      icon: <Settings size={18} />,
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <div className="p-4 text-white text-lg font-bold">
          {collapsed ? 'E' : 'E-Shop Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={navItems}
        />
        <div className="p-4 mt-auto">
          <Button 
            icon={<LogOut size={18} />} 
            danger 
            type="primary" 
            block
            onClick={handleLogout}
          >
            {collapsed ? '' : 'Logout'}
          </Button>
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={<MenuIcon />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          {session?.user && (
            <div className="mr-4 flex items-center">
              <span className="mr-4">Welcome, {session.user.name}</span>
            </div>
          )}
        </Header>
        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 