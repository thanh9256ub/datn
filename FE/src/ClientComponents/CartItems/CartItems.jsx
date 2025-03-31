import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    Button, Card, Col, Divider, Form, Input, List, Row, Select,
    Space, Typography, message, Spin, Empty, Image, Radio, Modal, Alert, Badge, Tag
} from 'antd';
import {
    DeleteOutlined, ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined,
    UserOutlined, CreditCardOutlined, MoneyCollectOutlined
} from '@ant-design/icons';
import { ShopContext } from '../Context/ShopContext';
import { fetchProvinces, fetchDistricts, fetchWards, fetchShippingFee } from '../Service/productService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CartItems = () => {
    const { cartItems, removeFromCart, getTotalCartAmount, clearCart } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [shippingFee, setShippingFee] = useState(0);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const paymentCheckInterval = useRef();

    const generateVietQrUrl = () => {
        const totalAmount = getTotalCartAmount() + shippingFee;
        return `https://img.vietqr.io/image/MB-0835520298-compact.png`;
    };

    const checkPaymentStatus = async () => {
        try {
            const isPaid = Math.random() > 0.5; // Mock
            if (isPaid) {
                clearInterval(paymentCheckInterval.current);
                setPaymentStatus('success');
                message.success('Thanh toán thành công qua VietQR!');
                setQrModalVisible(false);
            }
        } catch (error) {
            console.error('Lỗi kiểm tra thanh toán:', error);
        }
    };

    const startPaymentCheck = () => {
        setPaymentStatus('pending');
        paymentCheckInterval.current = setInterval(checkPaymentStatus, 5000);
    };

    const stopPaymentCheck = () => {
        clearInterval(paymentCheckInterval.current);
        setPaymentStatus(null);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value === 2) {
            setQrModalVisible(true);
            startPaymentCheck();
        }
    };

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await fetchProvinces();
                setProvinces(data);
            } catch (error) {
                message.error('Không thể tải danh sách tỉnh/thành phố');
            }
        };
        loadProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const loadDistricts = async () => {
                try {
                    const data = await fetchDistricts(selectedProvince);
                    setDistricts(data);
                    setSelectedDistrict('');
                    setWards([]);
                    form.setFieldsValue({ district: undefined, ward: undefined });
                } catch (error) {
                    message.error('Không thể tải danh sách quận/huyện');
                }
            };
            loadDistricts();
        }
    }, [selectedProvince, form]);

    useEffect(() => {
        if (selectedDistrict) {
            const loadWards = async () => {
                try {
                    const data = await fetchWards(selectedDistrict);
                    setWards(data);
                    setSelectedWard('');
                    form.setFieldsValue({ ward: undefined });
                } catch (error) {
                    message.error('Không thể tải danh sách phường/xã');
                }
            };
            loadWards();
        }
    }, [selectedDistrict, form]);

    const calculateTotalWeight = () => {
        return cartItems.reduce((total, item) => total + (item.weight || 600) * item.quantity, 0) || 1000;
    };

    const calculateShippingFee = async () => {
        if (!selectedProvince || !selectedDistrict) return;

        setShippingLoading(true);
        try {
            const response = await fetchShippingFee({
                PRODUCT_WEIGHT: calculateTotalWeight(),
                ORDER_SERVICE: selectedProvince == 1 ? "PHS" : "LCOD",
                SENDER_PROVINCE: 1,
                SENDER_DISTRICT: 28,
                RECEIVER_PROVINCE: selectedProvince,
                RECEIVER_DISTRICT: selectedDistrict
            });

            const fee = response.data?.data?.MONEY_TOTAL;
            if (fee !== undefined) {
                setShippingFee(fee);
            } else {
                message.warning('Không thể tính phí vận chuyển');
            }
        } catch (error) {
            message.error('Lỗi khi tính phí vận chuyển');
        } finally {
            setShippingLoading(false);
        }
    };

    useEffect(() => {
        calculateShippingFee();
    }, [selectedProvince, selectedDistrict, cartItems]);

    const handleCheckout = async () => {
        try {
            await form.validateFields();

            if (paymentMethod === 2 && paymentStatus !== 'success') {
                message.warning('Vui lòng hoàn thành thanh toán qua VietQR trước');
                return;
            }

            setLoading(true);
            const orderData = {
                paymentMethod,
                paymentStatus: paymentMethod === 2 ? 'paid' : 'pending',
                cartItems,
                totalAmount: getTotalCartAmount() + shippingFee,
            };

            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API
            message.success('Đặt hàng thành công!');
            clearCart();
            stopPaymentCheck();
        } catch (error) {
            message.error(error.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => clearInterval(paymentCheckInterval.current);
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Space style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    Giỏ hàng của bạn
                    <Badge count={cartItems.length} style={{ marginLeft: 16 }} />
                </Title>
            </Space>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title={<Text strong>Sản phẩm trong giỏ hàng</Text>} headStyle={{ backgroundColor: '#fafafa' }} bodyStyle={{ padding: 0 }}>
                        {cartItems.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={item => (
                                    <List.Item
                                        style={{ padding: '16px 24px' }}
                                        actions={[
                                            <Button icon={<DeleteOutlined />} danger onClick={() => removeFromCart(item.id)} />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Image src={item.productDetail?.image || 'https://via.placeholder.com/80'} width={80} height={80} style={{ objectFit: 'cover' }} preview={false} />}
                                            title={<Text strong>{item.productDetail?.product?.name || 'Sản phẩm'}</Text>}
                                            description={
                                                <Space size="middle" style={{ marginTop: 8 }}>
                                                    <Text>Giá: {(item.price || 0).toLocaleString('vi-VN')}₫</Text>
                                                    <Text>Số lượng: {item.quantity}</Text>
                                                    <Text>Màu: {item.productDetail?.color?.colorName || 'N/A'}</Text>
                                                    <Text>Size: {item.productDetail?.size?.sizeName || 'N/A'}</Text>
                                                </Space>
                                            }
                                        />
                                        <Space size="middle" style={{ marginRight: 16 }}>
                                            <Text strong style={{ minWidth: 100, textAlign: 'right' }}>
                                                {(item.total_price || item.price * item.quantity).toLocaleString('vi-VN')}₫
                                            </Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="Giỏ hàng của bạn đang trống" style={{ padding: '48px 0' }} />
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title={<Text strong>Thông tin thanh toán</Text>} headStyle={{ backgroundColor: '#fafafa' }}>
                        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
                            <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nguyễn Văn A" />
                            </Form.Item>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                <Input prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="0987654321" />
                            </Form.Item>
                            <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}>
                                <Select placeholder="Chọn tỉnh/thành phố" onChange={value => setSelectedProvince(value)} loading={!provinces.length} suffixIcon={<EnvironmentOutlined />}>
                                    {provinces.map(province => (
                                        <Option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>{province.PROVINCE_NAME}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}>
                                <Select placeholder="Chọn quận/huyện" onChange={value => setSelectedDistrict(value)} disabled={!selectedProvince} loading={!districts.length && !!selectedProvince} suffixIcon={<EnvironmentOutlined />}>
                                    {districts.map(district => (
                                        <Option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>{district.DISTRICT_NAME}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}>
                                <Select placeholder="Chọn phường/xã" onChange={value => setSelectedWard(value)} disabled={!selectedDistrict} loading={!wards.length && !!selectedDistrict} suffixIcon={<EnvironmentOutlined />}>
                                    {wards.map(ward => (
                                        <Option key={ward.WARDS_ID} value={ward.WARDS_ID}>{ward.WARDS_NAME}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ cụ thể" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                                <Input prefix={<EnvironmentOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Số nhà, tên đường" />
                            </Form.Item>
                            <Form.Item name="note" label="Ghi chú (tùy chọn)">
                                <TextArea rows={3} placeholder="Ghi chú về đơn hàng..." style={{ resize: 'none' }} />
                            </Form.Item>
                            <Divider orientation="left">Phương thức thanh toán</Divider>
                            <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]} initialValue={1}>
                                <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod} style={{ width: '100%' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Radio value={1}><Space><MoneyCollectOutlined /><div><Text strong>Thanh toán khi nhận hàng (COD)</Text><br /><Text type="secondary">Khách hàng thanh toán khi nhận được hàng</Text></div></Space></Radio>
                                        <Radio value={2}><Space><CreditCardOutlined /><div><Text strong>Chuyển khoản qua VietQR</Text><br /><Text type="secondary">Quét mã QR để thanh toán ngay</Text></div></Space></Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                            <Divider style={{ margin: '16px 0' }} />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Row justify="space-between"><Text>Tạm tính:</Text><Text strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</Text></Row>
                                <Spin spinning={shippingLoading}><Row justify="space-between"><Text>Phí vận chuyển:</Text><Text strong>{shippingFee.toLocaleString('vi-VN')}₫</Text></Row></Spin>
                                <Divider style={{ margin: '12px 0' }} />
                                <Row justify="space-between" style={{ marginBottom: 24 }}><Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text><Text strong style={{ fontSize: 18, color: '#1890ff' }}>{(getTotalCartAmount() + shippingFee).toLocaleString('vi-VN')}₫</Text></Row>
                                <Button type="primary" size="large" block loading={loading} onClick={handleCheckout} icon={<ShoppingCartOutlined />} disabled={cartItems.length === 0}>{paymentMethod === 2 ? 'Xác nhận đơn hàng' : 'Đặt hàng'}</Button>
                            </Space>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <Modal title="Thanh toán qua VietQR" visible={qrModalVisible} onCancel={() => { setQrModalVisible(false); stopPaymentCheck(); }} footer={null} width={350} destroyOnClose>
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                    {paymentStatus === 'success' ? (
                        <Alert message="Thanh toán thành công" description="Bạn đã thanh toán thành công qua VietQR" type="success" showIcon />
                    ) : (
                        <>
                            <Image src={generateVietQrUrl()} alt="VietQR Code" preview={false} style={{ maxWidth: '100%' }} />
                            <Text strong style={{ fontSize: 18 }}>{(getTotalCartAmount() + shippingFee).toLocaleString('vi-VN')}₫</Text>
                            <Text type="secondary">Vui lòng quét mã QR để thanh toán</Text>
                            {paymentStatus === 'pending' && <div style={{ marginTop: 16 }}><Spin tip="Đang kiểm tra thanh toán..." /></div>}
                        </>
                    )}
                </Space>
            </Modal>
        </div>
    );
};

export default CartItems;