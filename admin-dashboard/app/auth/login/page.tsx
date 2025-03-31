'use client';

import { Button, Card, Form, Input } from 'antd';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="Login to Admin Dashboard" className="w-full max-w-md">
        <Form layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input type="email" size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="w-full" icon={<ArrowRightIcon size={16} />}>
              Login
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Don&apos;t have an account? Register
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 