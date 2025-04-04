import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    Button, Card, Col, Divider, Form, Input, List, Row, Select,
    Space, Typography, Spin, Empty, Image, Radio, Modal, Alert, Badge, InputNumber, Checkbox, message
} from 'antd';
import {
    DeleteOutlined, ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined,
    UserOutlined, CreditCardOutlined, MoneyCollectOutlined
} from '@ant-design/icons';
import { ShopContext } from '../Context/ShopContext';
import { fetchProvinces, fetchDistricts, fetchWards, fetchShippingFee, createOrder, createGuestOrder, fetchCustomerProfile, clearCartOnServer, getCartDetails } from '../Service/productService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CartItems = () => {
    const {
        cartItems,
        setCartItems,
        removeFromCart,
        getTotalCartItems,
        getTotalCartAmount,
        clearCart,
        updateQuantity,
        toggleItemSelection,
        selectedItems,
        isGuest,
        customerId,
        loadCartItems,
        cartId,
        setCartId,
        token,
        getOrCreateCart,
    } = useContext(ShopContext);

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
    const [cartLoading, setCartLoading] = useState(false);
    const hasLoadedCart = useRef(false);
    const [customerProfile, setCustomerProfile] = useState(null);

    // Khởi tạo giỏ hàng
    useEffect(() => {
        console.log('CartItems mounted with:', { isGuest, cartId, token, cartItems });
        const initializeCart = async () => {
            setCartLoading(true);
            try {
                if (!isGuest && token) {
                    let currentCartId = cartId;
                    if (!currentCartId) {
                        const cartData = await getOrCreateCart(customerId);
                        currentCartId = cartData.id;
                        setCartId(currentCartId);
                    }
                    console.log('Loading cart from server with cartId:', currentCartId);
                    await loadCartItems(currentCartId);
                } else if (isGuest) {
                    const savedCart = localStorage.getItem('cartItems');
                    if (savedCart && cartItems.length === 0) {
                        setCartItems(JSON.parse(savedCart));
                    }
                }
                hasLoadedCart.current = true;
            } catch (error) {
                console.error('Không thể khởi tạo giỏ hàng:', error);
                message.error('Không thể tải giỏ hàng, vui lòng thử lại sau.');
            } finally {
                setCartLoading(false);
            }
        };
        if (!hasLoadedCart.current) {
            initializeCart();
        }
    }, [isGuest, cartId, token, customerId, loadCartItems, cartItems, getOrCreateCart, setCartId, setCartItems]);

    // Lấy thông tin khách hàng
    useEffect(() => {
        const loadCustomerProfile = async () => {
            if (!isGuest && token) {
                try {
                    const profile = await fetchCustomerProfile(token);
                    console.log('Customer profile:', profile);
                    setCustomerProfile(profile);
                    if (profile) {
                        setCustomerProfile(profile);
                        form.setFieldsValue({
                            name: profile.fullName || profile.name || '',
                            phone: profile.phone || profile.phoneNumber || profile.mobile || '',
                        });
                    }
                } catch (error) {
                    console.error('Không thể tải thông tin khách hàng:', error);
                    message.error('Không thể tải thông tin khách hàng.');
                }
            } else {
                setCustomerProfile(null);
                form.resetFields(['name', 'phone']);
            }
        };
        loadCustomerProfile();
    }, [isGuest, token, form]);

    const generateVietQrUrl = () => {
        const totalAmount = getTotalCartAmount() + shippingFee;
        return `https://img.vietqr.io/image/MB-0835520298-compact.png?amount=${totalAmount}`;
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
        } else {
            setQrModalVisible(false);
            stopPaymentCheck();
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

    // const handleCheckout = async () => {
    //     try {
    //         await form.validateFields();

    //         if (selectedItems.length === 0) {
    //             message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
    //             return;
    //         }

    //         if (paymentMethod === 2 && paymentStatus !== 'success') {
    //             message.warning('Vui lòng hoàn thành thanh toán qua VietQR trước');
    //             return;
    //         }

    //         setLoading(true);

    //         const formValues = form.getFieldsValue();
    //         const address = `${formValues.address}, ${wards.find(w => w.WARDS_ID === selectedWard)?.WARDS_NAME || ''}, 
    //         ${districts.find(d => d.DISTRICT_ID === selectedDistrict)?.DISTRICT_NAME || ''}, 
    //         ${provinces.find(p => p.PROVINCE_ID === selectedProvince)?.PROVINCE_NAME || ''}`;

    //         const selectedCartItems = cartItems
    //             .filter(item => selectedItems.includes(item.id || item.productDetailId))
    //             .map(item => ({
    //                 productDetailId: item.productDetailId || item.id,
    //                 quantity: item.quantity,
    //                 price: item.price,
    //                 total_price: item.total_price || item.price * item.quantity
    //             }));

    //         const orderData = {
    //             customerName: formValues.name,
    //             phone: formValues.phone,
    //             address: address,
    //             note: formValues.note || '',
    //             shippingFee: shippingFee,
    //             discountValue: 0.0,
    //             totalPrice: getTotalCartAmount(),
    //             totalPayment: getTotalCartAmount() + shippingFee,
    //             paymentMethodId: paymentMethod === 1 ? 3 : 2,
    //             paymentTypeId: 2,
    //             orderType: 1,
    //             status: paymentMethod === 1 ? 1 : 2,
    //             createdAt: new Date().toISOString(),
    //             updatedAt: new Date().toISOString(),
    //             cartItems: selectedCartItems,
    //             customerId: isGuest ? null : customerId
    //         };

    //         console.log('Order data to send:', JSON.stringify(orderData, null, 2));

    //         let response;
    //         if (isGuest) {
    //             response = await createGuestOrder(orderData);
    //             // Kiểm tra phản hồi từ API
    //             if (response.status === 201) {
    //                 message.success('Đặt hàng thành công!');
    //                 clearCart(); // Xóa giỏ hàng trên frontend
    //                 localStorage.removeItem('cartItems'); // Xóa giỏ hàng trong localStorage
    //             } else {
    //                 throw new Error('Tạo đơn hàng khách vãng lai thất bại');
    //             }
    //         } else {
    //             if (!cartId) {
    //                 console.log('CartId not found, attempting to initialize cart...');
    //                 setCartLoading(true);
    //                 try {
    //                     const cartData = await getOrCreateCart(customerId);
    //                     setCartId(cartData.id);
    //                     await loadCartItems(cartData.id);
    //                 } catch (error) {
    //                     throw new Error('Không thể khởi tạo giỏ hàng: ' + error.message);
    //                 } finally {
    //                     setCartLoading(false);
    //                 }
    //             }
    //             response = await createOrder(cartId, orderData);
    //             if (response.status === 201) {
    //                 message.success('Đặt hàng thành công!');
    //                 clearCart(); // Xóa giỏ hàng trên frontend
    //                 await loadCartItems(cartId); // Tải lại giỏ hàng từ server để đảm bảo đồng bộ
    //             } else {
    //                 throw new Error('Tạo đơn hàng thất bại');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi đặt hàng:', error);
    //         message.error(error.message || 'Đã có lỗi xảy ra khi đặt hàng');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleCheckout = async () => {
        try {
            await form.validateFields();

            if (selectedItems.length === 0) {
                message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
                return;
            }

            if (paymentMethod === 2 && paymentStatus !== 'success') {
                message.warning('Vui lòng hoàn thành thanh toán qua VietQR trước');
                return;
            }

            setLoading(true);

            const formValues = form.getFieldsValue();
            const address = `${formValues.address}, ${wards.find(w => w.WARDS_ID === selectedWard)?.WARDS_NAME || ''}, 
            ${districts.find(d => d.DISTRICT_ID === selectedDistrict)?.DISTRICT_NAME || ''}, 
            ${provinces.find(p => p.PROVINCE_ID === selectedProvince)?.PROVINCE_NAME || ''}`;

            const selectedCartItems = cartItems
                .filter(item => selectedItems.includes(item.id || item.productDetailId))
                .map(item => ({
                    productDetailId: item.productDetailId || item.id,
                    quantity: item.quantity,
                    price: item.price,
                    total_price: item.total_price || item.price * item.quantity
                }));

            const orderData = {
                customerName: formValues.name,
                phone: formValues.phone,
                address: address,
                note: formValues.note || '',
                shippingFee: shippingFee,
                discountValue: 0.0,
                totalPrice: getTotalCartAmount(),
                totalPayment: getTotalCartAmount() + shippingFee,
                paymentMethodId: paymentMethod === 1 ? 3 : 2,
                paymentTypeId: 2,
                orderType: 1,
                status: paymentMethod === 1 ? 1 : 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                cartItems: selectedCartItems,
                customerId: isGuest ? null : customerId
            };

            console.log('Order data to send:', JSON.stringify(orderData, null, 2));
            let response;
            if (isGuest) {
                response = await createGuestOrder(orderData);
                if (response.status === 201) {
                    message.success('Đặt hàng thành công!');
                    clearCart();
                    localStorage.removeItem('cartItems');
                } else {
                    throw new Error('Tạo đơn hàng khách vãng lai thất bại');
                }
            } else {
                if (!cartId) {
                    console.log('CartId not found, creating new cart...');
                    const cartData = await getOrCreateCart(customerId);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } else {
                    // Kiểm tra giỏ hàng trước khi đặt
                    const cartDetails = await getCartDetails(cartId);
                    if (!cartDetails.data.length || cartDetails.data[0]?.cart?.customerId !== customerId) {
                        console.log('Cart does not match customer, creating new cart...');
                        const cartData = await getOrCreateCart(customerId);
                        setCartId(cartData.id);
                        await loadCartItems(cartData.id);
                    }
                }

                response = await createOrder(cartId, orderData);
                console.log('Authenticated Order Response:', response.data); // Log phản hồi
                if (response.status === 201) {
                    message.success('Đặt hàng thành công!');
                    await clearCartOnServer(cartId); // Nếu có
                    clearCart();
                    setCartId(null);
                } else {
                    throw new Error('Tạo đơn hàng thất bại');
                }
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            message.error(error.message || 'Đã có lỗi xảy ra khi đặt hàng');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => clearInterval(paymentCheckInterval.current);
    }, []);

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    Giỏ hàng của bạn
                    <Badge count={getTotalCartItems()} style={{ marginLeft: 16 }} />
                </Title>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Lưu ý: Khách hàng chỉ được đặt tối đa 10 sản phẩm, nếu bạn có nhu cầu đặt thêm xin vui lòng liên hệ đến cửa hàng.
            </Text>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title={<Text strong>Sản phẩm trong giỏ hàng</Text>} headStyle={{ backgroundColor: '#fafafa' }} bodyStyle={{ padding: 0 }}>
                        {cartLoading ? (
                            <Spin tip="Đang tải giỏ hàng..." style={{ padding: '48px 0', width: '100%' }} />
                        ) : cartItems.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={item => {
                                    const itemId = item.id || item.productDetailId;
                                    return (
                                        <List.Item
                                            key={itemId}
                                            style={{ padding: '16px 24px' }}
                                            actions={[
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() => removeFromCart(itemId)}
                                                />
                                            ]}
                                        >
                                            <Checkbox
                                                checked={selectedItems.includes(itemId)}
                                                onChange={() => toggleItemSelection(itemId)}
                                                style={{ marginRight: 16 }}
                                            />
                                            <List.Item.Meta
                                                avatar={
                                                    <Image
                                                        src={item.productDetail?.product?.mainImage || 'https://via.placeholder.com/80'}
                                                        width={80}
                                                        height={80}
                                                        style={{ objectFit: 'cover' }}
                                                        preview={false}
                                                    />
                                                }
                                                title={<Text strong>{item.productDetail?.product?.productName || 'Sản phẩm'}</Text>}
                                                description={
                                                    <Space size="middle" style={{ marginTop: 8 }}>
                                                        <Text>Giá: {(item.price || 0).toLocaleString('vi-VN')}₫</Text>
                                                        <Space>
                                                            <Text>Số lượng:</Text>
                                                            <InputNumber
                                                                min={1}
                                                                max={10}
                                                                value={item.quantity}
                                                                onChange={(value) => updateQuantity(itemId, value)}
                                                                style={{ width: 60 }}
                                                            />
                                                        </Space>
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
                                    );
                                }}
                            />
                        ) : (
                            <Empty description="Giỏ hàng của bạn đang trống" style={{ padding: '48px 0' }} />
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title={<Text strong>Thông tin thanh toán</Text>} headStyle={{ backgroundColor: '#fafafa' }}>
                        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Nguyễn Văn A"
                                />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="0987654321"
                                />
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
                                <Row justify="space-between" style={{ marginBottom: 24 }}>
                                    <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                                    <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                        {(getTotalCartAmount() + shippingFee).toLocaleString('vi-VN')}₫
                                    </Text>
                                </Row>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={loading}
                                    onClick={handleCheckout}
                                    icon={<ShoppingCartOutlined />}
                                    disabled={cartItems.length === 0 || selectedItems.length === 0}
                                >
                                    {paymentMethod === 2 ? 'Xác nhận đơn hàng' : 'Đặt hàng'}
                                </Button>
                            </Space>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Thanh toán qua VietQR"
                visible={qrModalVisible}
                onCancel={() => { setQrModalVisible(false); stopPaymentCheck(); }}
                footer={null}
                width={350}
                destroyOnClose
            >
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                    {paymentStatus === 'success' ? (
                        <Alert
                            message="Thanh toán thành công"
                            description="Bạn đã thanh toán thành công qua VietQR"
                            type="success"
                            showIcon
                        />
                    ) : (
                        <>
                            <Image src={generateVietQrUrl()} alt="VietQR Code" preview={false} style={{ maxWidth: '100%' }} />
                            <Text strong style={{ fontSize: 18 }}>
                                {(getTotalCartAmount() + shippingFee).toLocaleString('vi-VN')}₫
                            </Text>
                            <Text type="secondary">Vui lòng quét mã QR để thanh toán</Text>
                            {paymentStatus === 'pending' && (
                                <div style={{ marginTop: 16 }}>
                                    <Spin tip="Đang kiểm tra thanh toán..." />
                                </div>
                            )}
                        </>
                    )}
                </Space>
            </Modal>
        </div>
    );
};

export default CartItems;