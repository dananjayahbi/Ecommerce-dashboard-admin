'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Form, Input, Button, Tabs, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { User, Camera } from 'lucide-react';

const { TabPane } = Tabs;

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'User'}&background=random`
  );
  const [editMode, setEditMode] = useState(false);

  // Initialize form with user data
  React.useEffect(() => {
    if (session?.user) {
      form.setFieldsValue({
        name: session.user.name,
        email: session.user.email,
      });
    }
  }, [session, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // In a real app, you would send this data to your API
      console.log('Updating profile with:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update session data (this is a dummy implementation)
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
          image: avatarUrl,
        }
      });
      
      message.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    try {
      // In a real app, you would send this to your API
      console.log('Updating password:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Password updated successfully');
      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      console.error('Error updating password:', error);
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Dummy avatar upload handler
  const handleAvatarChange = ({ file }) => {
    if (file.status !== 'uploading') {
      // Read the file and create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file.originFileObj);
      message.success('Avatar updated (dummy implementation)');
    }
  };

  // Custom avatar uploader UI
  const AvatarUploader = (
    <div className="relative w-32 h-32 group">
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500">
        <img 
          src={avatarUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      {editMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload 
            name="avatar"
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('You can only upload image files!');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
              }
              return isImage && isLt2M;
            }}
            onChange={handleAvatarChange}
          >
            <div className="flex flex-col items-center text-white cursor-pointer">
              <Camera size={24} />
              <span className="text-xs mt-1">Change</span>
            </div>
          </Upload>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!editMode ? (
          <Button type="primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        ) : (
          <Button onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="profile">
        <TabPane tab="Profile Information" key="profile">
          <Card className="shadow-md">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {AvatarUploader}
              
              <div className="flex-1">
                {!editMode ? (
                  <>
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
                  </>
                ) : (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    className="w-full"
                  >
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Name" />
                    </Form.Item>
                    
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Save Changes
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
            </div>
          </Card>
        </TabPane>
        
        <TabPane tab="Change Password" key="password">
          <Card className="shadow-md">
            <Form
              layout="vertical"
              onFinish={handlePasswordUpdate}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfilePage; 