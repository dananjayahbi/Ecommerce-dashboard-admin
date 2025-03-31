'use client';

import { Button, Card, Form, Input, message } from 'antd';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
  };

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      messageApi.success('Registration successful! Redirecting to login...');
      
      // Login with the newly created credentials
      await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      messageApi.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {contextHolder}
      <Card title="Register Admin Account" className="w-full max-w-md">
        <Form 
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item 
            label="Name" 
            name="name" 
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input size="large" placeholder="Enter your name" />
          </Form.Item>
          
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input type="email" size="large" placeholder="Enter your email" />
          </Form.Item>
          
          <Form.Item 
            label="Password" 
            name="password" 
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
          >
            <Input.Password size="large" placeholder="Create a password" />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              className="w-full" 
              icon={<ArrowRightIcon size={16} />}
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
          
          <div className="text-center mt-4">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage; 