import React from 'react'
import {
    Card,
    Button,
    Space,
    Typography,
    List,
    Tag
} from 'antd';
import {
    EnvironmentOutlined,
    PlusOutlined,
    CheckOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AddressBook = ({ addressData, customer }) => {
    return (
        <div>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}>
                    <Title level={4} style={{ margin: 0 }}>Sổ địa chỉ</Title>
                    {/* <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm địa chỉ mới
                                    </Button> */}
                </div>

                {addressData.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        dataSource={addressData}
                        renderItem={(item, index) => (
                            <List.Item
                                key={index}
                                extra={[
                                    <Button key="edit" type="link">Chỉnh sửa</Button>,
                                    <Button key="delete" type="link" danger>Xóa</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            {item.isDefault ? 'Địa chỉ mặc định' : `Địa chỉ ${index + 1}`}
                                            {item.isDefault && (
                                                <Tag icon={<CheckOutlined />} color="success">
                                                    Mặc định
                                                </Tag>
                                            )}
                                        </Space>
                                    }
                                    description={
                                        <div>
                                            <div style={{ marginBottom: 4 }}>
                                                <Text strong>{customer.fullName}</Text> | {customer.phone}
                                            </div>
                                            <div>
                                                <Text>{item.address}</Text>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Card>
                        <div style={{ textAlign: 'center', padding: 24 }}>
                            <EnvironmentOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                            <p>Chưa có địa chỉ nào được thêm</p>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Thêm địa chỉ mới
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default AddressBook