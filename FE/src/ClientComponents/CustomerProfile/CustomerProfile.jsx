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
import { fetchAddresses } from './AddressService';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const CustomerProfile = () => {
    const { customerId } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        const fetchCustomerAndAddresses = async () => {
            try {
                // Fetch customer data
                const customerResponse = await axios.get(`http://localhost:8080/customer/${customerId}`);
                const customerData = customerResponse.data;

                console.log("DAta: ", customerData)

                if (customerData.birthDate) {
                    customerData.birthDate = dayjs(customerData.birthDate);
                }

                setCustomer(customerData);

                // Fetch addresses
                const addressData = await fetchAddresses(customerId);
                console.log('Fetched addresses:', addressData);
                setAddresses(addressData || []);
            } catch (error) {
                message.error(error.message || 'Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchCustomerAndAddresses();
        }
    }, [customerId]);

    const onFinish = async (values) => {
        console.log("DATA VALUES: ", values)
        try {
            setLoading(true);
            if (values.birthDate) {
                values.birthDate = values.birthDate.format('YYYY-MM-DD');
            }
            const response = await updateCustomer(customerId, values);
            message.success('Cập nhật thông tin thành công');
            setCustomer(response.data);
            localStorage.setItem("fullName", values.fullName)
            setEditing(false);
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    // Handle address updates
    const handleAddressUpdate = async (newAddresses) => {
        try {
            console.log('Updating addresses:', newAddresses);
            setAddresses(newAddresses);
            // Refetch addresses to sync with backend
            const updatedAddresses = await fetchAddresses(customerId);
            console.log('Synced addresses:', updatedAddresses);
            setAddresses(updatedAddresses || []);
        } catch (error) {
            console.error('Failed to sync addresses:', error);
            message.error('Không thể đồng bộ danh sách địa chỉ');
        }
    };

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
                                addressData={addresses}
                                onAddressUpdate={handleAddressUpdate}
                            />
                        )}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default CustomerProfile;