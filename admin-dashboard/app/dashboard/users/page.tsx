'use client';

import { Button, Table, Tag } from 'antd';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const UsersPage = () => {
  const [loading, setLoading] = useState(false);

  // Demo data - will be replaced with actual API calls later
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', isAdmin: true, createdAt: '2023-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', isAdmin: false, createdAt: '2023-02-20' },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? 'blue' : 'green'}>
          {isAdmin ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link">Edit</Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button type="primary" icon={<PlusIcon size={16} />}>
          Add User
        </Button>
      </div>
      
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default UsersPage; 