import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import axios from 'axios';

const RevenueFilter = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [counterRevenue, setCounterRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order');
        const orders = response.data.data;

        setOrders(orders);

        // Calculate total revenue
        const revenue = orders
          .filter(order => order.status === 5)
          .reduce((sum, order) => sum + (order.totalPayment - order.shippingFee), 0);

        setTotalRevenue(revenue);

        // Calculate counter revenue
        const counterRev = orders
          .filter(order => order.status === 5 && order.orderType === 0)
          .reduce((sum, order) => sum + (order.totalPayment - order.shippingFee), 0);

        setCounterRevenue(counterRev);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic
              title="Doanh thu tổng"
              value={totalRevenue}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic
              title="Doanh thu tại quầy"
              value={counterRevenue}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
            <Statistic
              title="Doanh thu trực tuyến"
              value={totalRevenue - counterRevenue}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueFilter;
