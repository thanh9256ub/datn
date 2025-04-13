import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    Button, Card, Col, Divider, Form, Input, List, Row, Select,
    Space, Typography, Spin, Empty, Image, Radio, Modal, Alert, Badge, InputNumber, Checkbox, message
} from 'antd';
import {
    DeleteOutlined, ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined,
    UserOutlined, CreditCardOutlined, MoneyCollectOutlined, CheckCircleOutlined,
    TagOutlined
} from '@ant-design/icons';
import { ShopContext } from '../Context/ShopContext';
import {
    fetchProvinces, fetchDistricts, fetchWards, fetchShippingFee, createOrder,
    createGuestOrder, fetchCustomerProfile, clearCartOnServer, getCartDetails,
    checkStockAvailability, sendOrderConfirmationEmail, generateVNPayPayment,
    checkVNPayPaymentStatus, getVoucherByCode, createOrderVoucher
} from '../Service/productService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CartItems = () => {
    const {
        cartItems, setCartItems, removeFromCart, getTotalCartItems, getTotalCartAmount,
        updateQuantity, toggleItemSelection, selectedItems, isGuest,
        customerId, loadCartItems, cartId, setCartId, token, getOrCreateCart,
        setSelectedItems
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
    const [vnpayPaymentUrl, setVnpayPaymentUrl] = useState('');
    const [vnpayTransactionId, setVnpayTransactionId] = useState('');
    const [cartLoading, setCartLoading] = useState(false);
    const hasLoadedCart = useRef(false);
    const [customerProfile, setCustomerProfile] = useState(null);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [thankYouModalVisible, setThankYouModalVisible] = useState(false);
    const [orderCode, setOrderCode] = useState('');
    const [isConfirmModalLoading, setIsConfirmModalLoading] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const vnpayWindowRef = useRef(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);

    // Khởi tạo giỏ hàng
    useEffect(() => {
        console.log('CartItems được gắn với:', { isGuest, cartId, token, cartItems });
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
                    console.log('Đang tải giỏ hàng từ server với cartId:', currentCartId);
                    await loadCartItems(currentCartId);
                } else if (isGuest) {
                    const savedCart = localStorage.getItem('cartItems');
                    if (savedCart && cartItems.length === 0) {
                        const parsedCart = JSON.parse(savedCart);
                        setCartItems(parsedCart);
                        setSelectedItems(parsedCart.map(item => item.productDetailId || item.productDetail?.id));
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
    }, [isGuest, cartId, token, customerId, loadCartItems, cartItems, getOrCreateCart, setCartId, setCartItems, setSelectedItems]);

    // Lấy thông tin khách hàng
    useEffect(() => {
        const loadCustomerProfile = async () => {
            if (!isGuest && token) {
                try {
                    const profile = await fetchCustomerProfile(token);
                    console.log('Customer profile:', profile);
                    setCustomerProfile(profile);
                    if (profile) {
                        form.setFieldsValue({
                            name: profile.fullName || profile.name || '',
                            phone: profile.phone || profile.phoneNumber || profile.mobile || '',
                            email: profile.email || '',
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

    // Tạo URL thanh toán VNPAY và mở cửa sổ mới
    const generateVNPayPaymentHandler = async (orderId, totalAmount) => {
        try {
            const response = await generateVNPayPayment(orderId, totalAmount);
            setVnpayPaymentUrl(response.paymentUrl);
            console.log("Generated payment URL:", response.paymentUrl);
            setVnpayTransactionId(response.transactionId);

            // Mở cửa sổ mới cho VNPay
            vnpayWindowRef.current = window.open(response.paymentUrl, '_blank', 'width=600,height=800');
            if (!vnpayWindowRef.current) {
                message.error('Vui lòng cho phép popup để thanh toán qua VNPay!');
                return;
            }

            // Bắt đầu kiểm tra trạng thái thanh toán, truyền orderCode
            pollPaymentStatus(response.transactionId, orderId); // Truyền orderId (orderCode) vào đây
        } catch (error) {
            console.error('Lỗi khi tạo URL VNPAY:', error);
            message.error('Không thể tạo mã thanh toán VNPAY.');
        }
    };

    const pollPaymentStatus = async (transactionId, orderCode) => { // Thêm tham số orderCode
        setCheckingPayment(true);
        const maxAttempts = 450;
        let attempts = 0;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const statusResponse = await checkVNPayPaymentStatus(transactionId);
                console.log('Payment status response:', statusResponse);

                if (statusResponse.status === 'SUCCESS') {
                    clearInterval(interval);
                    setThankYouModalVisible(true);
                    message.success('Thanh toán thành công!');

                    const formValues = form.getFieldsValue();
                    await sendOrderConfirmationEmail(
                        formValues.email,
                        orderCode, // Sử dụng orderCode được truyền vào
                        formValues.name,
                        getTotalCartAmount() + shippingFee,
                        'VNPAY'
                    );

                    const validSelectedItems = selectedItems.filter(id =>
                        cartItems.some(item => (item.id === id || item.productDetailId === id || item.productDetail?.id === id))
                    );
                    setCartItems(prev => prev.filter(item =>
                        !validSelectedItems.includes(item.id || item.productDetailId || item.productDetail?.id)
                    ));
                    if (!isGuest) await clearCartOnServer(cartId);
                    else localStorage.setItem('cartItems', JSON.stringify(
                        cartItems.filter(item => !validSelectedItems.includes(item.productDetailId || item.productDetail?.id))
                    ));
                    setVoucherCode('');
                    setVoucherDiscount(0);
                    setVoucherError('');
                    // Xóa thông tin thanh toán
                    form.resetFields();
                    setSelectedProvince('');
                    setSelectedDistrict('');
                    setSelectedWard('');
                    setShippingFee(0);
                    if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                        vnpayWindowRef.current.close();
                    }
                    setCheckingPayment(false);
                } else if (statusResponse.status === 'FAILED') {
                    clearInterval(interval);
                    message.error('Thanh toán thất bại!');
                    if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                        vnpayWindowRef.current.close();
                    }
                    setCheckingPayment(false);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    message.error('Hết thời gian chờ thanh toán VNPAY!');
                    if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                        vnpayWindowRef.current.close();
                    }
                    setCheckingPayment(false);
                }
            } catch (error) {
                console.error('Error in pollPaymentStatus:', error);
                clearInterval(interval);
                message.error('Lỗi khi kiểm tra trạng thái thanh toán.');
                if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                    vnpayWindowRef.current.close();
                }
                setCheckingPayment(false);
            }
        }, 2000); // Kiểm tra mỗi 2 giây
    };

    const handleCheckoutConfirm = () => {
        setIsConfirmModalVisible(true);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
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

    const checkStockAvailabilityFrontend = async (itemsToCheck) => {
        const insufficientItems = [];
        const stockCheckRequest = itemsToCheck.map(item => ({
            productDetailId: item.productDetailId
        }));
        console.log('Full list of items to check stock:', stockCheckRequest);
        try {
            const stockAvailability = await checkStockAvailability(stockCheckRequest);
            itemsToCheck.forEach(item => {
                const availableStock = stockAvailability[item.productDetailId] || 0;
                console.log('Stock availability response:', stockAvailability);
                if (availableStock < item.quantity) {
                    insufficientItems.push({
                        name: item.productDetail?.product?.productName || 'Sản phẩm',
                        color: item.productDetail?.color?.colorName || 'N/A',
                        size: item.productDetail?.size?.sizeName || 'N/A',
                        requested: item.quantity,
                        available: availableStock
                    });
                }
            });
            return insufficientItems;
        } catch (error) {
            console.error('Lỗi khi kiểm tra tồn kho:', error);
            message.error('Không thể kiểm tra tồn kho, vui lòng thử lại sau.');
            return null;
        }
    };

    const handleCheckout = async () => {
        console.log('Các mục trong giỏ hàng hiện tại:', JSON.stringify(cartItems, null, 2));
        console.log('Các mục đã chọn:', selectedItems);
        try {
            await form.validateFields();

            if (selectedItems.length === 0) {
                message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
                return;
            }

            setLoading(true);

            const formValues = form.getFieldsValue();
            const address = `${formValues.address}, ${wards.find(w => w.WARDS_ID === selectedWard)?.WARDS_NAME || ''}, 
                ${districts.find(d => d.DISTRICT_ID === selectedDistrict)?.DISTRICT_NAME || ''}, 
                ${provinces.find(p => p.PROVINCE_ID === selectedProvince)?.PROVINCE_NAME || ''}`;

            const validSelectedItems = selectedItems.filter(id =>
                cartItems.some(item =>
                    (item.id === id || item.productDetailId === id || item.productDetail?.id === id)
                )
            );

            if (validSelectedItems.length === 0) {
                message.error('Không có sản phẩm hợp lệ nào được chọn để thanh toán');
                setLoading(false);
                return;
            }

            const selectedCartItems = cartItems
                .filter(item => {
                    const itemId = item.id || item.productDetailId || item.productDetail?.id;
                    return validSelectedItems.includes(itemId);
                })
                .map(item => ({
                    productDetailId: item.productDetail?.id || item.productDetailId,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.total_price || item.price * item.quantity
                }));

            console.log('Các mục trong giỏ hàng đã chọn trước khi kiểm tra tồn kho:', selectedCartItems);

            if (selectedCartItems.length === 0) {
                message.error('Không có sản phẩm nào để kiểm tra tồn kho');
                setLoading(false);
                return;
            }

            const insufficientItems = await checkStockAvailabilityFrontend(selectedCartItems);
            if (insufficientItems === null) {
                setLoading(false);
                return;
            }
            if (insufficientItems.length > 0) {
                const errorMessage = insufficientItems.map(item =>
                    `Yêu cầu ${item.requested}, chỉ còn ${item.available}`
                ).join('\n');
                message.error(`Không đủ sản phẩm trong kho:\n${errorMessage}`, 5);
                setLoading(false);
                return;
            }

            const totalAmount = getTotalCartAmount() + shippingFee - voucherDiscount;
            const orderData = {
                customerName: formValues.name,
                phone: formValues.phone,
                email: formValues.email,
                address: address,
                note: formValues.note || '',
                shippingFee: shippingFee,
                discountValue: voucherDiscount,
                totalPrice: getTotalCartAmount(),
                totalPayment: totalAmount,
                paymentMethodId: paymentMethod === 1 ? 3 : 2, // 3: COD, 2: VNPAY
                paymentTypeId: 2,
                orderType: 1,
                status: paymentMethod === 1 ? 1 : 1, // Trạng thái ban đầu là 1
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                cartItems: selectedCartItems,
                customerId: isGuest ? null : customerId
            };

            console.log('Dữ liệu đơn hàng gửi đi:', JSON.stringify(orderData, null, 2));
            let response;
            let voucherData = null;
            if (voucherCode && voucherDiscount > 0) {
                voucherData = await getVoucherByCode(voucherCode);
                // Kiểm tra lại voucher để đảm bảo tính nhất quán
                if (!voucherData || voucherData.quantity <= 0) {
                    message.error('Mã khuyến mãi đã hết số lượng hoặc không hợp lệ');
                    setLoading(false);
                    return;
                }
                const currentDate = new Date();
                const voucherEndDate = new Date(voucherData.endDate);
                if (voucherEndDate < currentDate) {
                    message.error('Mã khuyến mãi đã hết hạn');
                    setLoading(false);
                    return;
                }
                if (getTotalCartAmount() < voucherData.minOrderValue) {
                    message.error(`Đơn hàng phải có giá trị tối thiểu ${voucherData.minOrderValue.toLocaleString('vi-VN')}₫`);
                    setLoading(false);
                    return;
                }
                // Kiểm tra lại giảm giá
                let calculatedDiscount = voucherData.discountValue;
                if (voucherData.discountType === 1) {
                    calculatedDiscount = (voucherData.discountValue / 100) * getTotalCartAmount();
                    if (voucherData.maxDiscountValue && calculatedDiscount > voucherData.maxDiscountValue) {
                        calculatedDiscount = voucherData.maxDiscountValue;
                    }
                    if (calculatedDiscount !== voucherDiscount) {
                        setVoucherDiscount(calculatedDiscount);
                    }
                }
            }

            if (isGuest) {
                response = await createGuestOrder(orderData);
            } else {
                if (!cartId) {
                    console.log('Không tìm thấy cartId, đang tạo giỏ hàng mới...');
                    const cartData = await getOrCreateCart(customerId);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } else {
                    const cartDetails = await getCartDetails(cartId);
                    if (!cartDetails.data.length || cartDetails.data[0]?.cart?.customerId !== customerId) {
                        console.log('Giỏ hàng không khớp với khách hàng, đang tạo giỏ hàng mới...');
                        const cartData = await getOrCreateCart(customerId);
                        setCartId(cartData.id);
                        await loadCartItems(cartData.id);
                    }
                }
                response = await createOrder(cartId, orderData);
            }

            if (response.status === 201) {
                const orderCode = response.data?.orderCode || response.data?.data?.orderCode;
                console.log("===Mã đơn hàng===" + orderCode);
                setOrderCode(orderCode);

                // Tạo OrderVoucher nếu voucher được áp dụng
                if (voucherData) {
                    const orderVoucherData = {
                        orderId: response.data?.id || response.data?.data?.id,
                        voucherId: voucherData.id,
                        status: '1'
                    };
                    try {
                        await createOrderVoucher(orderVoucherData);
                    } catch (error) {
                        message.error(error.message || 'Không thể áp dụng mã khuyến mãi do lỗi hệ thống');
                        setLoading(false);
                        return;
                    }
                }

                if (paymentMethod === 2) { // VNPAY
                    await generateVNPayPaymentHandler(orderCode, totalAmount);
                } else { // COD
                    setThankYouModalVisible(true);
                    message.success('Đặt hàng thành công!');
                    await sendOrderConfirmationEmail(
                        formValues.email,
                        orderCode,
                        formValues.name,
                        totalAmount,
                        'COD'
                    );
                    setCartItems(prev => prev.filter(item =>
                        !validSelectedItems.includes(item.id || item.productDetail?.id)
                    ));
                    if (!isGuest) await clearCartOnServer(cartId);
                    else localStorage.setItem('cartItems', JSON.stringify(
                        cartItems.filter(item => !validSelectedItems.includes(item.productDetailId || item.productDetail?.id))
                    ));
                    // Đặt lại trạng thái voucher
                    setVoucherCode('');
                    setVoucherDiscount(0);
                    setVoucherError('');
                    // Xóa thông tin thanh toán
                    form.resetFields();
                    setSelectedProvince('');
                    setSelectedDistrict('');
                    setSelectedWard('');
                    setShippingFee(0);
                }
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            message.error(error.message || 'Đã có lỗi xảy ra khi đặt hàng');
        } finally {
            setLoading(false);
            setIsConfirmModalVisible(false);
        }
    };

    const handleConfirmOk = async () => {
        setIsConfirmModalLoading(true);
        try {
            await handleCheckout();
        } finally {
            setIsConfirmModalLoading(false);
        }
    };

    const handleConfirmCancel = () => {
        setIsConfirmModalVisible(false);
    };

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
                                    const itemId = item.id || item.productDetailId || item.productDetail?.id;
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
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Card
                            title={
                                <Space>
                                    <TagOutlined style={{ color: '#faad14' }} />
                                    <Text strong>Mã khuyến mãi</Text>
                                </Space>
                            }
                            headStyle={{ backgroundColor: '#fffbe6' }}
                        >
                            <Form.Item>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        placeholder="Nhập mã khuyến mãi"
                                        value={voucherCode}
                                        onChange={(e) => {
                                            setVoucherCode(e.target.value);
                                            setVoucherError('');
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            if (selectedItems.length === 0) {
                                                setVoucherError('Vui lòng chọn ít nhất một sản phẩm trước khi áp dụng mã khuyến mãi');
                                                return;
                                            }

                                            if (!voucherCode) {
                                                setVoucherError('Vui lòng nhập mã khuyến mãi');
                                                return;
                                            }

                                            setVoucherLoading(true);
                                            try {
                                                const voucher = await getVoucherByCode(voucherCode);
                                                if (!voucher) {
                                                    setVoucherError('Mã khuyến mãi không hợp lệ');
                                                    setVoucherDiscount(0);
                                                    setVoucherLoading(false);
                                                    return;
                                                }

                                                if (voucher.quantity <= 0) {
                                                    setVoucherError('Mã khuyến mãi đã hết số lượng sử dụng');
                                                    setVoucherDiscount(0);
                                                    setVoucherLoading(false);
                                                    return;
                                                }

                                                const currentDate = new Date();
                                                const voucherEndDate = new Date(voucher.endDate);
                                                if (voucherEndDate < currentDate) {
                                                    setVoucherError('Mã khuyến mãi đã hết hạn');
                                                    setVoucherDiscount(0);
                                                    setVoucherLoading(false);
                                                    return;
                                                }

                                                const totalCartAmount = getTotalCartAmount();
                                                if (totalCartAmount < voucher.minOrderValue) {
                                                    setVoucherError(`Đơn hàng phải có giá trị tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}₫ để áp dụng mã này`);
                                                    setVoucherDiscount(0);
                                                    setVoucherLoading(false);
                                                    return;
                                                }

                                                let calculatedDiscount = 0;
                                                if (voucher.discountType === 0) {
                                                    calculatedDiscount = voucher.discountValue;
                                                } else if (voucher.discountType === 1) {
                                                    calculatedDiscount = (voucher.discountValue / 100) * totalCartAmount;
                                                    if (voucher.maxDiscountValue && calculatedDiscount > voucher.maxDiscountValue) {
                                                        calculatedDiscount = voucher.maxDiscountValue;
                                                        message.info(`Giảm giá đã được giới hạn ở mức tối đa ${voucher.maxDiscountValue.toLocaleString('vi-VN')}₫`);
                                                    }
                                                } else {
                                                    setVoucherError('Loại giảm giá không hợp lệ');
                                                    setVoucherDiscount(0);
                                                    setVoucherLoading(false);
                                                    return;
                                                }

                                                setVoucherDiscount(calculatedDiscount);
                                                message.success('Áp dụng mã khuyến mãi thành công!');
                                                setVoucherError('');
                                            } catch (error) {
                                                if (error.response && error.response.status === 404) {
                                                    setVoucherError('Mã khuyến mãi không tồn tại');
                                                } else {
                                                    setVoucherError(error.message || 'Có lỗi khi kiểm tra mã khuyến mãi');
                                                }
                                                setVoucherDiscount(0);
                                            } finally {
                                                setVoucherLoading(false);
                                            }
                                        }}
                                        loading={voucherLoading}
                                    >
                                        Áp dụng
                                    </Button>
                                </Space.Compact>
                                {voucherError && <Text type="danger" style={{ display: 'block', marginTop: 8 }}>{voucherError}</Text>}
                                {voucherDiscount > 0 && (
                                    <Alert
                                        message={`Đã áp dụng giảm giá ${voucherDiscount.toLocaleString('vi-VN')}₫`}
                                        type="success"
                                        showIcon
                                        style={{ marginTop: 12 }}
                                    />
                                )}
                            </Form.Item>
                        </Card>
                        <Card title={<Text strong>Thông tin thanh toán</Text>} headStyle={{ backgroundColor: '#fafafa' }}>
                            <Form form={form} layout="vertical" initialValues={{ remember: true }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="name"
                                        label="Họ tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Email không hợp lệ' }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input placeholder="example@email.com" type="email" />
                                    </Form.Item>

                                    <Form.Item
                                        name="province"
                                        label="Tỉnh/Thành"
                                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Select
                                            placeholder="Chọn tỉnh/thành"
                                            onChange={value => setSelectedProvince(value)}
                                            loading={!provinces.length}
                                            suffixIcon={<EnvironmentOutlined />}
                                        >
                                            {provinces.map(province => (
                                                <Option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>{province.PROVINCE_NAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="district"
                                        label="Quận/Huyện"
                                        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Select
                                            placeholder="Chọn quận/huyện"
                                            onChange={value => setSelectedDistrict(value)}
                                            disabled={!selectedProvince}
                                            loading={!districts.length && !!selectedProvince}
                                            suffixIcon={<EnvironmentOutlined />}
                                        >
                                            {districts.map(district => (
                                                <Option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>{district.DISTRICT_NAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="ward"
                                        label="Phường/Xã"
                                        rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Select
                                            placeholder="Chọn phường/xã"
                                            onChange={value => setSelectedWard(value)}
                                            disabled={!selectedDistrict}
                                            loading={!wards.length && !!selectedDistrict}
                                            suffixIcon={<EnvironmentOutlined />}
                                        >
                                            {wards.map(ward => (
                                                <Option key={ward.WARDS_ID} value={ward.WARDS_ID}>{ward.WARDS_NAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="address"
                                        label="Địa chỉ"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường" />
                                    </Form.Item>

                                    <Form.Item name="note" label="Ghi chú" style={{ marginBottom: 16 }}>
                                        <TextArea rows={2} placeholder="Ghi chú về đơn hàng..." style={{ resize: 'none' }} />
                                    </Form.Item>

                                    <Divider orientation="left" style={{ marginTop: 0 }}>Phương thức thanh toán</Divider>

                                    <Form.Item
                                        name="paymentMethod"
                                        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                                        initialValue={1}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Radio.Group
                                            onChange={handlePaymentMethodChange}
                                            value={paymentMethod}
                                            style={{ width: '100%' }}
                                        >
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Radio value={1} style={{ whiteSpace: 'nowrap' }}>
                                                    <Space size="small">
                                                        <MoneyCollectOutlined />
                                                        <Text>Thanh toán khi nhận hàng </Text>
                                                    </Space>
                                                </Radio>
                                                <Radio value={2} style={{ whiteSpace: 'nowrap' }}>
                                                    <Space size="small">
                                                        <CreditCardOutlined />
                                                        <Text>Thanh toán qua VNPAY</Text>
                                                    </Space>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Space>
                            </Form>

                            <Divider style={{ margin: '12px 0' }} />

                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Row justify="space-between">
                                    <Text>Tạm tính:</Text>
                                    <Text strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</Text>
                                </Row>
                                <Spin spinning={shippingLoading}>
                                    <Row justify="space-between">
                                        <Text>Phí vận chuyển:</Text>
                                        <Text strong>{shippingFee.toLocaleString('vi-VN')}₫</Text>
                                    </Row>
                                </Spin>
                                {voucherDiscount > 0 && (
                                    <Row justify="space-between">
                                        <Text>Giảm giá:</Text>
                                        <Text strong style={{ color: '#ff4d4f' }}>-{voucherDiscount.toLocaleString('vi-VN')}₫</Text>
                                    </Row>
                                )}
                                <Divider style={{ margin: '8px 0' }} />
                                <Row justify="space-between" style={{ marginBottom: 16 }}>
                                    <Text strong>Tổng cộng:</Text>
                                    <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                        {(getTotalCartAmount() + shippingFee - voucherDiscount).toLocaleString('vi-VN')}₫
                                    </Text>
                                </Row>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={loading}
                                    onClick={handleCheckoutConfirm}
                                    icon={<ShoppingCartOutlined />}
                                    disabled={cartItems.length === 0 || selectedItems.length === 0}
                                >
                                    Đặt hàng
                                </Button>
                            </Space>
                        </Card>
                    </Space>
                </Col>
                <Modal
                    title="Xác nhận đặt hàng"
                    visible={isConfirmModalVisible}
                    onOk={handleConfirmOk}
                    onCancel={handleConfirmCancel}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    confirmLoading={isConfirmModalLoading}
                    okButtonProps={{ disabled: isConfirmModalLoading }}
                >
                    <Text>Bạn có chắc chắn muốn đặt đơn hàng này không?</Text>
                    <Divider />
                    <Row justify="space-between">
                        <Text>Tổng tiền hàng:</Text>
                        <Text strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</Text>
                    </Row>
                    <Row justify="space-between">
                        <Text>Phí vận chuyển:</Text>
                        <Text strong>{shippingFee.toLocaleString('vi-VN')}₫</Text>
                    </Row>
                    {voucherDiscount > 0 && (
                        <Row justify="space-between">
                            <Text>Giảm giá (mã khuyến mãi):</Text>
                            <Text strong>-{voucherDiscount.toLocaleString('vi-VN')}₫</Text>
                        </Row>
                    )}
                    <Row justify="space-between">
                        <Text strong>Tổng thanh toán:</Text>
                        <Text strong style={{ color: '#1890ff' }}>
                            {(getTotalCartAmount() + shippingFee - voucherDiscount).toLocaleString('vi-VN')}₫
                        </Text>
                    </Row>
                </Modal>

                <Modal
                    title="Cảm ơn bạn đã đặt hàng"
                    visible={thankYouModalVisible}
                    onOk={() => setThankYouModalVisible(false)}
                    onCancel={() => setThankYouModalVisible(false)}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => setThankYouModalVisible(false)}
                        >
                            Đóng
                        </Button>
                    ]}
                    centered
                >
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                        <Title level={4} style={{ marginBottom: 8 }}>Đơn hàng của bạn đã được tiếp nhận!</Title>
                        <Text style={{ display: 'block', marginBottom: 16 }}>
                            Mã đơn hàng: <strong>{orderCode}</strong><br />
                            Vui lòng kiểm tra email để biết thêm thông tin về đơn hàng.
                        </Text>
                    </div>
                </Modal>
            </Row>
        </div>
    );
};

export default CartItems;