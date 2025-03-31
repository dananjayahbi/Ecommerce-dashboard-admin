'use client';

import { Button, Card, Form, Input, message } from 'antd';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  // Initialize database and check for default admin
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setInitializing(true);
        
        // First, initialize the database
        await fetch('/api/db-init');
        
        // Then, check if a default admin was created
        const response = await fetch('/api/auth/init');
        
        if (!response.ok) {
          throw new Error('Failed to check admin initialization status');
        }
        
        const data = await response.json();
        
        if (data.success && data.credentials) {
          messageApi.info(
            'Default admin account created. Please use the following credentials to login: ' +
            `Email: ${data.credentials.email}, Password: ${data.credentials.password}`
          );
          
          // Pre-fill the login form with the default credentials
          form.setFieldsValue({
            email: data.credentials.email,
            password: data.credentials.password
          });
        }
      } catch (error) {
        console.error('Error initializing database:', error);
        // Show default credentials anyway so user can try them
        messageApi.info(
          'Default admin credentials: Email: admin@example.com, Password: admin123'
        );
        
        // Pre-fill with default values
        form.setFieldsValue({
          email: 'admin@example.com',
          password: 'admin123'
        });
      } finally {
        setInitializing(false);
      }
    };

    initDatabase();
  }, [messageApi, form]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      
      if (result?.error) {
        messageApi.error('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      messageApi.error('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {contextHolder}
      <Card title="Login to Admin Dashboard" className="w-full max-w-md">
        <Form 
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type="email" size="large" placeholder="Enter your email" />
          </Form.Item>
          
          <Form.Item 
            label="Password" 
            name="password" 
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              className="w-full" 
              icon={<ArrowRightIcon size={16} />}
              loading={loading || initializing}
              disabled={initializing}
            >
              {initializing ? 'Initializing...' : 'Login'}
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