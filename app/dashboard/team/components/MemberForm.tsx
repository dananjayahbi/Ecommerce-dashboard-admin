'use client';

import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

export interface TeamMember {
  id?: string | number;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

interface MemberFormProps {
  initialValues?: TeamMember;
  onSubmit: (values: TeamMember & { password?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const isEditMode = !!initialValues?.id;

  const handleSubmit = (values: TeamMember & { password?: string }) => {
    // If editing, include the id
    if (isEditMode) {
      onSubmit({ ...values, id: initialValues!.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {}}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the name' }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter the email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      {/* Password field (only required for new members) */}
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { 
            required: !isEditMode, 
            message: 'Please enter a password' 
          },
          { 
            min: 6, 
            message: 'Password must be at least 6 characters' 
          }
        ]}
      >
        <Input.Password 
          placeholder={isEditMode ? "Enter new password (leave empty to keep current)" : "Enter password"} 
        />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select placeholder="Select a role">
          <Option value="Admin">Admin</Option>
          <Option value="Member">Member</Option>
          <Option value="Developer">Developer</Option>
          <Option value="Designer">Designer</Option>
          <Option value="Marketing">Marketing</Option>
          <Option value="Support">Support</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="avatar"
        label="Avatar URL"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
      >
        <Input placeholder="Enter avatar image URL (optional)" />
      </Form.Item>

      <Form.Item className="flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEditMode ? 'Update Member' : 'Add Member'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MemberForm; 