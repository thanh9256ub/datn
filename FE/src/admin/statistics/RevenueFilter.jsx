import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Row, Col, Statistic, Select } from 'antd';
import axios from 'axios';

const RevenueFilter = () => {
   
  const [orders , setOrders ] = useState([]);
  
    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await axios.get('http://localhost:8080/order');
                   const orders = response.data.data;
               
                setOrders(orders);
console.log(orders);
            } catch (error) {
                console.error('Failed to fetch revenue data:', error);
            }
        };

        fetchRevenue();
    }, []);
    // Chỉ gọi API một lần khi component được mount

    return (
        <>
       
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Card style={{ textAlign: 'center', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                        <Statistic 
                            title="Doanh thu tổng " 
                            value={3543000000} 
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} 
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ textAlign: 'center', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                        <Statistic 
                            title="Doanh thu tại quầy " 
                            value={3043000000} 
                            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} 
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ textAlign: 'center', backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
                        <Statistic 
                            title="Doanh thu trực tuyến" 
                            value={3543000000-3043000000} 
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }} 
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default RevenueFilter;
