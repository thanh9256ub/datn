import React from 'react'
import {
    Avatar,
    Button,
    Divider,
    Typography
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import avt from '../../../assets/images/faces/avt.jpg';

const { Title, Text } = Typography;

const CustomerWall = ({ customer, activeTab, setActiveTab }) => {
    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 0'
            }}>

                <Avatar
                    size={120}
                    src={avt}
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: '#1890ff',
                        marginBottom: 16,
                        border: '4px solid #fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                />

                <Title level={4} style={{ marginBottom: 4 }}>
                    {customer.fullname}
                </Title>
                <Text type="secondary" style={{ marginBottom: 8 }}>
                    <MailOutlined /> {customer.email}
                </Text>
                <Text type="secondary">
                    <PhoneOutlined /> {customer.phone || 'Chưa cập nhật'}
                </Text>

                <Divider style={{ margin: '16px 0' }} />

                <Button
                    type={activeTab === '1' ? 'primary' : 'default'}
                    block
                    onClick={() => setActiveTab('1')}
                    style={{ marginBottom: 8, textAlign: 'left' }}
                    icon={<UserOutlined />}
                >
                    Thông tin cá nhân
                </Button>

                <Button
                    type={activeTab === '2' ? 'primary' : 'default'}
                    block
                    onClick={() => setActiveTab('2')}
                    style={{ marginBottom: 8, textAlign: 'left' }}
                    icon={<LockOutlined />}
                >
                    Đổi mật khẩu
                </Button>

                <Button
                    type={activeTab === '3' ? 'primary' : 'default'}
                    block
                    onClick={() => setActiveTab('3')}
                    style={{ textAlign: 'left' }}
                    icon={<EnvironmentOutlined />}
                >
                    Sổ địa chỉ
                </Button>
            </div>
        </div>
    )
}

export default CustomerWall