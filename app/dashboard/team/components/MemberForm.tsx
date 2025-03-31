'use client';

import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const isEditMode = !!initialValues?.id;
  const currentUserRole = session?.user?.role || 'Member';

  // Initialize form with default values or existing member data
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    onSubmit({
      id: initialValues?.id,
      ...values,
    });
  };

  // Determine which roles can be selected based on current user's role
  const canAssignAdmin = currentUserRole === 'Super-Admin' || 
                         (currentUserRole === 'Admin' && !isEditMode);
  
  // Check if editing an Admin or Super-Admin
  const isEditingAdminOrSuperAdmin = isEditMode && 
                                    (initialValues?.role === 'Admin' || initialValues?.role === 'Super-Admin');
  
  // Check if we're editing a Super-Admin
  const isEditingSuperAdmin = isEditMode && initialValues?.role === 'Super-Admin';
  
  // Only Super-Admin can modify Admin or Super-Admin users
  const canEditThisUser = currentUserRole === 'Super-Admin' || 
                         (currentUserRole === 'Admin' && initialValues?.role !== 'Admin' && initialValues?.role !== 'Super-Admin');

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || { role: 'Member' }}
      disabled={isLoading || !canEditThisUser}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter a name' }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter an email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      {!isEditMode && (
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select 
          placeholder="Select a role"
          disabled={isEditingAdminOrSuperAdmin && currentUserRole !== 'Super-Admin' || isEditingSuperAdmin}
        >
          {/* Only show Super-Admin option if editing an existing Super-Admin */}
          {isEditingSuperAdmin && 
            <Option value="Super-Admin">Super-Admin</Option>
          }
          {canAssignAdmin && 
            <Option value="Admin">Admin</Option>
          }
          <Option value="Member">Member</Option>
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
        <Button type="primary" htmlType="submit" loading={isLoading} disabled={!canEditThisUser}>
          {isEditMode ? 'Update Member' : 'Add Member'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MemberForm; 