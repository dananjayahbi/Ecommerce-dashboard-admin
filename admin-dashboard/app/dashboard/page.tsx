'use client';

import { Card, Col, Row, Statistic } from 'antd';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Sales" 
              value={1250} 
              prefix={<DollarSign size={20} />} 
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Products" 
              value={24} 
              prefix={<ShoppingCart size={20} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Users" 
              value={54} 
              prefix={<Users size={20} />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 