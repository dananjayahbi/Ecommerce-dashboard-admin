'use client';

import { Button, Table, Tag } from 'antd';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const ProductsPage = () => {
  const [loading, setLoading] = useState(false);

  // Demo data - will be replaced with actual API calls later
  const products = [
    { 
      id: '1', 
      name: 'Product 1', 
      price: 99.99, 
      stock: 10, 
      category: 'Electronics'
    },
    { 
      id: '2', 
      name: 'Product 2', 
      price: 49.99, 
      stock: 5, 
      category: 'Clothing'
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link">Edit</Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button type="primary" icon={<PlusIcon size={16} />}>
          Add Product
        </Button>
      </div>
      
      <Table 
        dataSource={products} 
        columns={columns} 
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default ProductsPage;
 