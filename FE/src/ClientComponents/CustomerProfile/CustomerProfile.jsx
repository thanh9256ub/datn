import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Form,
    message,
    Row,
    Col,
    Typography,
    Select,
    Skeleton,
} from 'antd';

import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import CustomerInfo from './component/CustomerInfo';
import CustomerChangePassword from './component/CustomerChangePassword';
import AddressBook from './component/AddressBook';
import CustomerWall from './component/CustomerWall';
import { updateCustomer } from '../../admin/customers/service/CustomersService';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const CustomerProfile = () => {
    const { customerId } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/customer/${customerId}`);
                const data = response.data;

                if (data.birthDate) {
                    data.birthDate = dayjs(data.birthDate);
                }

                setCustomer(data);
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            if (values.birthDate) {
                values.birthDate = values.birthDate.format('YYYY-MM-DD');
            }
            const response = await updateCustomer(customerId, values)
            message.success('Cập nhật thông tin thành công');
            setCustomer(response.data)
            setEditing(false);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addressData = customer?.addressList || [];

    if (loading && !customer) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (!customer) {
        return <div style={{ textAlign: 'center', padding: 50 }}>Không tìm thấy khách hàng</div>;
    }

    return (
        <div style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '24px 16px',
            backgroundColor: '#ffffff',
            marginTop: 70
        }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: 1200,
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    margin: '0px auto'
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} md={8}>
                        <CustomerWall
                            customer={customer}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </Col>

                    <Col xs={24} md={16}>
                        {activeTab === '1' && (
                            <CustomerInfo
                                editing={editing}
                                setEditing={setEditing}
                                form={form}
                                customer={customer}
                                loading={loading}
                                onFinish={onFinish}
                            />
                        )}

                        {activeTab === '2' && (
                            <CustomerChangePassword
                                loading={loading}
                                setLoading={setLoading}
                                form={form}
                                customerId={customerId}
                            />
                        )}

                        {activeTab === '3' && (
                            <AddressBook
                                customer={customer}
                                addressData={addressData}
                            />
                        )}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default CustomerProfile;