'use client';

import { Button, Card, Divider, Form, Input, Select, Switch } from 'antd';
import { SaveIcon } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <Form layout="vertical">
          <h2 className="text-xl font-semibold mb-4">Store Settings</h2>
          
          <Form.Item label="Store Name" name="storeName">
            <Input placeholder="Enter store name" />
          </Form.Item>
          
          <Form.Item label="Store Email" name="storeEmail">
            <Input type="email" placeholder="Enter store email" />
          </Form.Item>
          
          <Form.Item label="Currency" name="currency">
            <Select
              defaultValue="USD"
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
              ]}
            />
          </Form.Item>
          
          <Divider />
          
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          
          <Form.Item label="Email Notifications" valuePropName="checked" name="emailNotifications">
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" icon={<SaveIcon size={16} />}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage; 