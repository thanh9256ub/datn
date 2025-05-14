import React, { useEffect, useState } from 'react';
import {
    Descriptions,
    Card,
    Tag,
    Table,
    Typography,
    Spin,
    Empty,
    Button,
    message,
    Row,
    Col,
    Divider,
    Steps,
    Space,
    Badge,
    Image,
    Alert,
    Modal
} from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    TruckOutlined,
    CloseCircleOutlined,
    DropboxOutlined,
    ArrowLeftOutlined,
    DollarOutlined,
    FileTextOutlined,
    UserOutlined,
    HomeOutlined,
    PrinterOutlined,
    HistoryOutlined,
    IdcardOutlined,
    CalendarOutlined,
    ShoppingOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';
import { fetchOrderDetailsByOrderId } from '../Service/productService';
import Statistic from 'antd/es/statistic/Statistic';

const { Title, Text } = Typography;
const { Step } = Steps;

const MyOrderDetail = () => {
    const { id } = useParams();
    const history = useHistory();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderDetailsByOrderId(id);
                console.log("Data order detail:", data);

                if (Array.isArray(data) && data.length > 0) {
                    const validDetails = data.filter(item => item && item.price != null && item.productDetail);
                    setOrder({
                        ...data[0].order,
                        orderDetails: validDetails
                    });
                } else if (data?.order && Array.isArray(data.orderDetails)) {
                    const validDetails = data.orderDetails.filter(item => item && item.price != null && item.productDetail);
                    setOrder({
                        ...data.order,
                        orderDetails: validDetails
                    });
                } else {
                    setOrder(null); // fallback nếu không có gì hợp lệ
                }
            } catch (error) {
                console.error('Error loading order detail:', error);
                message.error('Không thể tải chi tiết đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    const getStatusSteps = (status, orderType, paymentType) => {
        if (orderType === 0 && paymentType?.paymentTypeName === 'Trực tiếp') {
            return [
                <Step
                    key="5"
                    title="Hoàn tất"
                    icon={<CheckCircleOutlined />}
                    status="finish"
                />
            ];
        }

        const steps = [
            {
                key: '1',
                title: 'Chờ xác nhận',
                icon: <ClockCircleOutlined />,
                status: status >= 1 ? 'finish' : 'wait',
            },
            {
                key: '2',
                title: 'Đã xác nhận',
                icon: <DropboxOutlined />,
                status: status >= 2 ? 'finish' : 'wait',
            },
            {
                key: '3',
                title: 'Chờ vận chuyển',
                icon: <TruckOutlined />,
                status: status >= 3 ? 'finish' : 'wait',
            },
            {
                key: '4',
                title: 'Đang vận chuyển',
                icon: <TruckOutlined />,
                status: status >= 4 ? 'finish' : 'wait',
            },
            {
                key: '5',
                title: 'Hoàn tất',
                icon: <CheckCircleOutlined />,
                status: status >= 5 ? 'finish' : 'wait',
            },
        ];

        if (status === 6) {
            return [
                <Step
                    key="6"
                    title="Đã hủy"
                    icon={<CloseCircleOutlined />}
                    status="error"
                />
            ];
        }

        return steps.map((step) => (
            <Step
                key={step.key}
                title={step.title}
                icon={step.icon}
                status={step.status}
            />
        ));
    };

    const getOrderTypeName = (orderType) => {
        return orderType === 0
            ? { name: "Tại quầy", color: "cyan" }
            : { name: "Đơn online", color: "purple" };
    };

    const handleBack = () => {
        history.push("/my-orders");
    };

    const calculateTotalPayment = () => {
        if (!order) return 0;
        return (order.totalPrice || 0) + (order.shippingFee || 0) - (order.discountValue || 0);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spin size="large" />
            </div>
        );
    }

    if (!order) {
        return (
            <Empty description="Không tìm thấy đơn hàng">
                <Button type="primary" onClick={handleBack}>
                    Quay lại
                </Button>
            </Empty>
        );
    }

    const {
        orderCode,
        createdAt,
        status,
        paymentType,
        shippingFee,
        discountValue,
        totalPrice,
        orderDetails,
        orderType,
        customerName,
        phone,
        address
    } = order;

    const total = calculateTotalPayment();

    const totalPayment = totalPrice + shippingFee - discountValue;

    return (
        <div className="container py-4" style={{ marginTop: 70 }}>
            <Card>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Title level={3} style={{ margin: 0 }}>
                        Chi tiết đơn hàng #{orderCode}
                    </Title>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                            type="text"
                        >
                            Quay lại
                        </Button>
                    </Space>
                </div>

                <Card title="Trạng thái đơn hàng" className="mb-4">
                    <Steps current={status - 1} status={status === 6 ? 'error' : 'process'}>
                        {getStatusSteps(status, orderType, paymentType)}
                    </Steps>
                </Card>

                <Row gutter={16}>
                    {/* Cột trái - Thông tin đơn hàng và sản phẩm */}
                    <Col xs={24} md={16}>
                        {/* Thông tin cơ bản */}
                        <Card className="mb-4" title="Thông tin đơn hàng">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Text strong><IdcardOutlined /> Mã đơn hàng</Text>}>
                                    {orderCode}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><CalendarOutlined /> Ngày đặt</Text>}>
                                    {new Date(createdAt).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><ShoppingOutlined /> Loại đơn</Text>}>
                                    <Tag color={getOrderTypeName(orderType).color}>
                                        {getOrderTypeName(orderType).name}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><DollarOutlined /> Hình thức thanh toán</Text>}>
                                    {paymentType?.paymentTypeName}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card
                            title={`Danh sách sản phẩm (${(orderDetails ?? []).length})`}
                            className="mb-4"
                            bodyStyle={{ padding: 10 }}
                        >
                            <Table
                                dataSource={orderDetails}
                                columns={[
                                    {
                                        title: 'Thông tin sản phẩm',
                                        dataIndex: ['productDetail', 'product'],
                                        key: 'product',
                                        render: (product, record) => (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Image
                                                    src={product?.mainImage || '/default-product.png'}
                                                    alt={product?.productName}
                                                    preview={false}
                                                    width={60}
                                                    height={60}
                                                    style={{ objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
                                                    fallback="/default-product.png"
                                                />
                                                <div style={{ marginLeft: '10px' }}>
                                                    <Text strong>{product?.productName || 'N/A'}</Text>
                                                    <div>
                                                        <Text type="secondary">
                                                            Màu: {record.productDetail?.color?.colorName} / Size: {record.productDetail?.size?.sizeName}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        title: 'Đơn giá',
                                        dataIndex: 'price',
                                        key: 'price',
                                        align: 'right',
                                        render: (price) => (
                                            <Text>{price?.toLocaleString()} ₫</Text>
                                        ),
                                        width: 120,
                                    },
                                    {
                                        title: 'Số lượng',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                        align: 'center',
                                        width: 100,
                                    },
                                    {
                                        title: 'Thành tiền',
                                        key: 'total',
                                        align: 'right',
                                        render: (_, record) => (
                                            <Text strong>{(record.quantity * record.price)?.toLocaleString()} ₫</Text>
                                        ),
                                        width: 150,
                                    },
                                ]}
                                rowKey="id"
                                pagination={false}
                                bordered={false}
                                size="middle"
                                locale={{
                                    emptyText: (
                                        <Alert
                                            message="Không có sản phẩm nào"
                                            type="info"
                                            showIcon
                                        />
                                    )
                                }}
                            />
                        </Card>
                    </Col>

                    {/* Cột phải - Thông tin khách hàng và thanh toán */}
                    <Col xs={24} md={8}>
                        {/* Thông tin khách hàng */}
                        <Card className="mb-4" title="Thông tin khách hàng">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Text strong><UserOutlined /> Tên khách hàng</Text>}>
                                    {customerName || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><PhoneOutlined /> Số điện thoại</Text>}>
                                    {phone || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><HomeOutlined /> Địa chỉ</Text>}>
                                    {address || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Tổng thanh toán */}
                        <Card title="Tổng thanh toán">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Statistic
                                        title="Tổng tiền hàng"
                                        value={totalPrice}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        suffix="₫"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Statistic
                                        title="Phí vận chuyển"
                                        value={shippingFee}
                                        precision={0}
                                        suffix="₫"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Statistic
                                        title="Giảm giá"
                                        value={-discountValue}
                                        precision={0}
                                        valueStyle={{ color: '#cf1322' }}
                                        suffix="₫"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <Statistic
                                        title="Tổng thanh toán"
                                        value={totalPayment}
                                        precision={0}
                                        valueStyle={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}
                                        suffix="₫"
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>

        </div>
    );
};

export default MyOrderDetail;