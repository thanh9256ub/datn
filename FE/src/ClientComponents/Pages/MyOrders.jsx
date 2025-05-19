import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Tag,
    Button,
    Space,
    Typography,
    Pagination,
    Spin,
    Empty,
    message,
    Row,
    Col,
    Statistic,
    Divider
} from 'antd';
import {
    EyeOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TruckOutlined,
    CloseCircleOutlined,
    DropboxOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCustomerOrders } from '../Service/productService';

const { Title, Text } = Typography;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const pageSize = 5;
    const { customerId } = useAuth();
    const history = useHistory();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                if (customerId) {
                    const data = await fetchCustomerOrders(customerId);
                    setOrders(data);

                    // Tính tổng số tiền các đơn hàng
                    const amount = data.reduce((sum, order) => {
                        return sum + (order.totalPrice || 0) + (order.shippingFee || 0) - (order.discountValue || 0);
                    }, 0);
                    setTotalAmount(amount);
                    setTotalOrders(data.length);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                message.error('Không thể tải đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [customerId]);

    const getStatusTag = (status, orderType, paymentType) => {
        if (orderType === 0 && paymentType?.paymentTypeName === 'Trực tiếp') {
            return (
                <Tag icon={<CheckCircleOutlined />} color="green">
                    Hoàn tất
                </Tag>
            );
        }

        const statusMap = {
            1: { text: 'Chờ xác nhận', color: 'orange', icon: <ClockCircleOutlined /> },
            2: { text: 'Đã xác nhận', color: 'gold', icon: <DropboxOutlined /> },
            3: { text: 'Chờ vận chuyển', color: 'blue', icon: <TruckOutlined /> },
            4: { text: 'Đang vận chuyển', color: 'geekblue', icon: <TruckOutlined /> },
            5: { text: 'Hoàn tất', color: 'green', icon: <CheckCircleOutlined /> },
            6: { text: 'Đã hủy', color: 'red', icon: <CloseCircleOutlined /> },
            7: { text: 'Giao hàng không thành công', color: 'red', icon: <CloseCircleOutlined /> },
        };

        const info = statusMap[status];
        if (!info) return <Tag color="default">Không xác định</Tag>;

        return (
            <Tag icon={info.icon} color={info.color}>
                {info.text}
            </Tag>
        );
    };

    const handleViewDetail = (orderId) => {
        history.push(`/my-orders/${orderId}`);
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
            width: 150,
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            width: 150,
            render: (_, record) => {
                const total =
                    (record.totalPrice || 0) +
                    (record.shippingFee || 0) -
                    (record.discountValue || 0);
                return <Text strong>{total.toLocaleString()} VNĐ</Text>;
            },
        },
        {
            title: 'Loại đơn',
            key: 'orderType',
            width: 120,
            render: (text, record) => (
                <Tag color={record.orderType === 0 ? 'cyan' : 'purple'}>
                    {record.orderType === 0 ? 'Tại quầy' : 'Online'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 180,
            render: (_, record) =>
                getStatusTag(record.status, record.orderType, record.paymentType),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    type="link"
                    onClick={() => handleViewDetail(record.id)}
                    style={{ padding: 0 }}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const paginatedOrders = orders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="container py-4" style={{ marginTop: 70 }}>
            <Card
                title={<Title level={3}>Đơn hàng của tôi</Title>}
                extra={
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => history.push('/products')}
                    >
                        Mua sắm ngay
                    </Button>
                }
            >
                <Row gutter={16} className="mb-4">
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng"
                                value={totalOrders}
                                prefix={<DropboxOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng chi tiêu"
                                value={totalAmount}
                                prefix="VNĐ"
                                valueStyle={{ color: '#3f8600' }}
                                suffix={
                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                        (đã bao gồm VAT)
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center my-5">
                        <Spin size="large" />
                    </div>
                ) : orders.length > 0 ? (
                    <>
                        <Table
                            columns={columns}
                            dataSource={paginatedOrders}
                            rowKey="id"
                            pagination={false}
                            bordered
                            scroll={{ x: 800 }}
                        />

                        <div className="d-flex justify-content-center mt-4">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={orders.length}
                                onChange={(page) => setCurrentPage(page)}
                                showSizeChanger={false}
                            />
                        </div>
                    </>
                ) : (
                    <Empty
                        description={
                            <Text type="secondary">Bạn chưa có đơn hàng nào</Text>
                        }
                        className="my-5"
                    >
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => history.push('/products')}
                        >
                            Mua sắm ngay
                        </Button>
                    </Empty>
                )}
            </Card>
        </div>
    );
};

export default MyOrders;