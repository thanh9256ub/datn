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
    checkVNPayPaymentStatus, getVoucherByCode, createOrderVoucher, fetchProductDetailsByIds, checkPriceDiscrepancies, updateCartOnServer
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

    // Initialize cart
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
                } else if (isGuest && cartItems.length === 0) {
                    const savedCart = localStorage.getItem('cartItems');
                    if (savedCart) {
                        const parsedCart = JSON.parse(savedCart);
                        setCartItems(parsedCart);
                        setSelectedItems(parsedCart.map((item) => item.productDetailId || item.productDetail?.id));
                    }
                }
                hasLoadedCart.current = true;
            } catch (error) {
                console.error('Failed to initialize cart:', error);
                message.error('Không thể tải giỏ hàng, vui lòng thử lại sau.');
            } finally {
                setCartLoading(false);
            }
        };
        if (!hasLoadedCart.current) {
            initializeCart();
        }
    }, [isGuest, cartId, token, customerId, loadCartItems, getOrCreateCart, setCartId, setCartItems, setSelectedItems]);

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
                    console.error('Failed to load customer profile:', error);
                    message.error('Không thể tải thông tin khách hàng.');
                }
            } else {
                setCustomerProfile(null);
                form.resetFields(['name', 'phone']);
            }
        };
        loadCustomerProfile();
    }, [isGuest, token, form]);

    useEffect(() => {
        if (cartId && !isGuest) {
            const intervalId = setInterval(async () => {
                try {
                    await loadCartItems(cartId);
                } catch (error) {
                    console.error('Lỗi khi làm mới giỏ hàng:', error);
                    message.error('Không thể làm mới giỏ hàng. Vui lòng thử lại.');
                }
            }, 3000);

            return () => clearInterval(intervalId);
        }
    }, [isGuest, cartId, loadCartItems]);

    useEffect(() => {
        if (selectedItems.length === 0 && (voucherCode || voucherDiscount > 0)) {
            setVoucherCode('');
            setVoucherDiscount(0);
            setVoucherError('');
            message.info('Mã giảm giá đã bị xóa vì không có sản phẩm nào được chọn.');
        }
    }, [selectedItems, voucherCode, voucherDiscount]);


    // Generate VNPay payment URL and open new window
    const generateVNPayPaymentHandler = async (orderId, totalAmount) => {
        try {
            const response = await generateVNPayPayment(orderId, totalAmount);
            setVnpayPaymentUrl(response.paymentUrl);
            console.log("Generated payment URL:", response.paymentUrl);
            setVnpayTransactionId(response.transactionId);

            vnpayWindowRef.current = window.open(response.paymentUrl, '_blank', 'width=600,height=800');
            if (!vnpayWindowRef.current) {
                message.error('Vui lòng cho phép popup để thanh toán qua VNPay!');
                return;
            }

            pollPaymentStatus(response.transactionId, orderId);
        } catch (error) {
            console.error('Lỗi khi tạo URL VNPAY:', error);
            message.error('Không thể tạo mã thanh toán VNPAY.');
        }
    };

    const pollPaymentStatus = async (transactionId, orderCode) => {
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
                        orderCode,
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

                    if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                        vnpayWindowRef.current.close();
                        if (!vnpayWindowRef.current.closed) {
                            vnpayWindowRef.current.location.href = 'about:blank';
                            setTimeout(() => {
                                if (vnpayWindowRef.current && !vnpayWindowRef.current.closed) {
                                    vnpayWindowRef.current.close();
                                }
                            }, 100);
                        }
                    }

                    form.resetFields();
                    setSelectedProvince('');
                    setSelectedDistrict('');
                    setSelectedWard('');
                    setShippingFee(0);
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
        }, 2000);
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
                message.error('Không thể tải danh sách tỉnh/thành phố.');
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
                    message.error('Không thể tải danh sách quận/huyện.');
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
                    message.error('Không thể tải danh sách phường/xã.');
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
                message.warning('Không thể tính phí vận chuyển.');
            }
        } catch (error) {
            message.error('Lỗi khi tính phí vận chuyển.');
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
                        color: item.productDetail?.color?.colorName || 'Không có',
                        size: item.productDetail?.size?.sizeName || 'Không có',
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

    const verifyPricesBeforeCheckout = async () => {
        try {
            const selectedProducts = cartItems.filter(item =>
                selectedItems.includes(item.id || item.productDetailId || item.productDetail?.id)
            );

            // Kiểm tra dữ liệu đầu vào
            console.log('Selected products for price verification:', selectedProducts);

            const discrepancies = await checkPriceDiscrepancies(selectedProducts);
            console.log('Discrepancies received:', discrepancies);

            if (discrepancies.length === 0) {
                return true; // Không có sự khác biệt giá
            }

            const productDetailIds = discrepancies.map(d => d.productDetailId);
            const productDetails = await fetchProductDetailsByIds(productDetailIds);
            console.log('Product details received:', productDetails);

            // Đảm bảo currentPrice được lấy từ cartItems
            const messageContent = (
                <div>
                    <p>Giá của {discrepancies.length} sản phẩm đã thay đổi:</p>
                    <ul>
                        {discrepancies.map((item, index) => {
                            const detail = productDetails.find(pd => pd.id === item.productDetailId) || {};
                            const cartItem = selectedProducts.find(ci => ci.productDetailId === item.productDetailId || ci.productDetail?.id === item.productDetailId);
                            // Lấy giá hiện tại từ cartItem, đảm bảo không bị undefined
                            const currentPrice = cartItem?.price || item.currentPrice || 0;
                            const newPrice = typeof item.newPrice === 'number' ? item.newPrice : 0;

                            return (
                                <li key={index}>
                                    {detail?.product?.productName || item.productName || 'Sản phẩm không xác định'} -
                                    Màu: {detail?.color?.colorName || item.color || 'Không rõ'},
                                    Size: {detail?.size?.sizeName || item.size || 'Không rõ'}<br />
                                    Giá cũ: {currentPrice.toLocaleString('vi-VN')}₫ →
                                    Giá mới: {newPrice.toLocaleString('vi-VN')}₫
                                </li>
                            );
                        })}
                    </ul>
                    <p>Vui lòng xóa và cập nhật lại sản phẩm trước khi đặt hàng.</p>
                </div>
            );

            Modal.error({
                title: 'Giá sản phẩm đã thay đổi',
                content: messageContent,
                okText: 'Đã hiểu',
            });

            return false;
        } catch (error) {
            console.error('Error in verifyPricesBeforeCheckout:', error);
            message.error(error.message || 'Lỗi khi kiểm tra giá sản phẩm.');
            return false;
        }
    };

    const handleCheckout = async () => {
        console.log('Các mục trong giỏ hàng hiện tại:', JSON.stringify(cartItems, null, 2));
        console.log('Các mục đã chọn:', selectedItems);
        try {
            await form.validateFields();

            if (selectedItems.length === 0) {
                message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
                return;
            }
            const pricesValid = await verifyPricesBeforeCheckout();
            if (!pricesValid) return;
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
                message.error('Không có sản phẩm hợp lệ được chọn để thanh toán.');
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

            console.log('Selected cart items before stock check:', selectedCartItems);

            if (selectedCartItems.length === 0) {
                message.error('Không có sản phẩm nào để kiểm tra tồn kho.');
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
                message.error(`Không đủ hàng trong kho:\n${errorMessage}`, 5);
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
                paymentMethodId: paymentMethod === 1 ? 3 : 2,
                paymentTypeId: 2,
                orderType: 1,
                status: paymentMethod === 1 ? 1 : 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                cartItems: selectedCartItems,
                customerId: isGuest ? null : customerId
            };

            console.log('Order data sent:', JSON.stringify(orderData, null, 2));
            let response;
            let voucherData = null;
            if (!isGuest && voucherCode && voucherDiscount > 0) {
                voucherData = await getVoucherByCode(voucherCode);
                if (!voucherData || voucherData.quantity <= 0) {
                    message.error('Mã giảm giá đã hết lượt sử dụng hoặc không hợp lệ.');
                    setLoading(false);
                    return;
                }
                const currentDate = new Date();
                const voucherEndDate = new Date(voucherData.endDate);
                if (voucherEndDate < currentDate) {
                    message.error('Mã giảm giá đã hết hạn.');
                    setLoading(false);
                    return;
                }
                if (getTotalCartAmount() < voucherData.minOrderValue) {
                    message.error(`Đơn hàng phải có giá trị tối thiểu ${voucherData.minOrderValue.toLocaleString('vi-VN')}₫ để áp dụng mã này.`);
                    setLoading(false);
                    return;
                }
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
                    console.log('CartId not found, creating new cart...');
                    const cartData = await getOrCreateCart(customerId);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } else {
                    const cartDetails = await getCartDetails(cartId);
                    if (!cartDetails.data.length || cartDetails.data[0]?.cart?.customerId !== customerId) {
                        console.log('Cart does not match customer, creating new cart...');
                        const cartData = await getOrCreateCart(customerId);
                        setCartId(cartData.id);
                        await loadCartItems(cartData.id);
                    }
                }
                response = await createOrder(cartId, orderData);
            }

            if (response.status === 201) {
                const orderCode = response.data?.orderCode || response.data?.data?.orderCode;
                console.log("===Order Code===" + orderCode);
                setOrderCode(orderCode);

                if (voucherData) {
                    const orderVoucherData = {
                        orderId: response.data?.id || response.data?.data?.id,
                        voucherId: voucherData.id,
                        status: '1'
                    };
                    try {
                        await createOrderVoucher(orderVoucherData);
                    } catch (error) {
                        message.error(error.message || 'Không thể áp dụng mã giảm giá do lỗi hệ thống.');
                        setLoading(false);
                        return;
                    }
                }

                if (paymentMethod === 2) {
                    await generateVNPayPaymentHandler(orderCode, totalAmount);
                } else {
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
                    setVoucherCode('');
                    setVoucherDiscount(0);
                    setVoucherError('');
                    form.resetFields();
                    setSelectedProvince('');
                    setSelectedDistrict('');
                    setSelectedWard('');
                    setShippingFee(0);
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            message.error(error.message || 'Có lỗi xảy ra khi đặt hàng.');
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

    const trimWhitespace = (e) => {
        const value = e.target.value.trim();
        e.target.value = value;
        return value;
    };

    const validateAddress = (_, value) => {
        if (value.trim() !== value) {
            return Promise.reject(new Error('Địa chỉ không được chứa khoảng trắng ở đầu hoặc cuối.'));
        }

        const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\?~]/;
        if (specialChars.test(value)) {
            return Promise.reject(new Error('Địa chỉ không được chứa ký tự đặc biệt.'));
        }

        return Promise.resolve();
    };

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    Giỏ Hàng Của Bạn
                    <Badge count={getTotalCartItems()} style={{ marginLeft: 16 }} />
                </Title>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Lưu ý: Khách hàng có thể đặt tối đa 10 sản phẩm. Vui lòng liên hệ cửa hàng nếu bạn cần đặt thêm.
            </Text>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title={<Text strong>Sản Phẩm Trong Giỏ Hàng</Text>} headStyle={{ backgroundColor: '#fafafa' }} bodyStyle={{ padding: 0 }}>
                        {cartLoading ? (
                            <Spin tip="Đang tải giỏ hàng..." style={{ padding: '48px 0', width: '100%' }} />
                        ) : cartItems.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={item => {
                                    const itemId = item.id || item.productDetailId || item.productDetail?.id;
                                    const availableStock = item.productDetail?.quantity || 0;
                                    const maxQuantity = Math.min(10, availableStock);

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
                                                                max={maxQuantity}
                                                                value={item.quantity}
                                                                onChange={(value) => {
                                                                    if (value > availableStock) {
                                                                        message.error(`Số lượng tối đa cho sản phẩm này là ${availableStock}.`);
                                                                        return;
                                                                    }
                                                                    if (value > 10) {
                                                                        message.error('Số lượng tối đa cho mỗi sản phẩm là 10.');
                                                                        return;
                                                                    }
                                                                    updateQuantity(itemId, value);
                                                                }}
                                                                style={{ width: 60 }}
                                                            />
                                                        </Space>
                                                        <Text>Màu sắc: {item.productDetail?.color?.colorName || 'Không có'}</Text>
                                                        <Text>Kích cỡ: {item.productDetail?.size?.sizeName || 'Không có'}</Text>
                                                    </Space>
                                                }
                                            />
                                            <Space size="middle" style={{ marginRight: 16 }}>
                                                <Text strong style={{ minWidth: 100, textAlign: 'right' }}>
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
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
                                    <Text strong>Mã Giảm Giá</Text>
                                </Space>
                            }
                            headStyle={{ backgroundColor: '#fffbe6' }}
                        >
                            {isGuest ? (
                                <Text type="secondary">Vui lòng đăng nhập để sử dụng mã giảm giá.</Text>
                            ) : (
                                <Form.Item>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            value={voucherCode}
                                            onChange={(e) => {
                                                const trimmedValue = e.target.value.trim();
                                                setVoucherCode(trimmedValue);
                                                setVoucherError('');
                                            }}
                                            onBlur={(e) => {
                                                const trimmedValue = e.target.value.trim();
                                                setVoucherCode(trimmedValue);
                                                form.setFieldsValue({ voucherCode: trimmedValue });
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            onClick={async () => {
                                                if (selectedItems.length === 0) {
                                                    setVoucherError('Vui lòng chọn ít nhất một sản phẩm trước khi áp dụng mã giảm giá.');
                                                    return;
                                                }

                                                if (!voucherCode) {
                                                    setVoucherError('Vui lòng nhập mã giảm giá.');
                                                    return;
                                                }

                                                setVoucherLoading(true);
                                                try {
                                                    const voucher = await getVoucherByCode(voucherCode);
                                                    if (!voucher) {
                                                        setVoucherError('Mã giảm giá không hợp lệ.');
                                                        setVoucherDiscount(0);
                                                        setVoucherLoading(false);
                                                        return;
                                                    }

                                                    if (voucher.quantity <= 0) {
                                                        setVoucherError('Mã giảm giá đã hết lượt sử dụng.');
                                                        setVoucherDiscount(0);
                                                        setVoucherLoading(false);
                                                        return;
                                                    }

                                                    const currentDate = new Date();
                                                    const voucherEndDate = new Date(voucher.endDate);
                                                    if (voucherEndDate < currentDate) {
                                                        setVoucherError('Mã giảm giá đã hết hạn.');
                                                        setVoucherDiscount(0);
                                                        setVoucherLoading(false);
                                                        return;
                                                    }

                                                    const totalCartAmount = getTotalCartAmount();
                                                    if (totalCartAmount < voucher.minOrderValue) {
                                                        setVoucherError(`Đơn hàng phải có giá trị tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}₫ để áp dụng mã này.`);
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
                                                            message.info(`Giảm giá tối đa được giới hạn ở ${voucher.maxDiscountValue.toLocaleString('vi-VN')}₫.`);
                                                        }
                                                    } else {
                                                        setVoucherError('Loại giảm giá không hợp lệ.');
                                                        setVoucherDiscount(0);
                                                        setVoucherLoading(false);
                                                        return;
                                                    }

                                                    setVoucherDiscount(calculatedDiscount);
                                                    message.success('Áp dụng mã giảm giá thành công!');
                                                    setVoucherError('');
                                                } catch (error) {
                                                    if (error.response && error.response.status === 404) {
                                                        setVoucherError('Mã giảm giá không tồn tại.');
                                                    } else {
                                                        setVoucherError(error.message || 'Lỗi khi kiểm tra mã giảm giá.');
                                                    }
                                                    setVoucherDiscount(0);
                                                } finally {
                                                    setVoucherLoading(false);
                                                }
                                            }}
                                            loading={voucherLoading}
                                        >
                                            Áp Dụng
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
                            )}
                        </Card>
                        <Card title={<Text strong>Thông Tin Thanh Toán</Text>} headStyle={{ backgroundColor: '#fafafa' }}>
                            <Form form={form} layout="vertical" initialValues={{ remember: true }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="name"
                                        label="Họ và Tên"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập họ và tên.' },
                                            { max: 100, message: 'Họ và tên không được vượt quá 100 ký tự.' },
                                            {
                                                validator: (_, value) => {
                                                    if (!value) {
                                                        return Promise.reject(new Error('Vui lòng nhập họ và tên.'));
                                                    }
                                                    if (value.trim() !== value) {
                                                        return Promise.reject(new Error('Không được chứa khoảng trắng ở đầu hoặc cuối.'));
                                                    }
                                                    if (/[@#$%^&*]/.test(value)) {
                                                        return Promise.reject(new Error('Họ và tên không được chứa ký tự đặc biệt'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Nguyễn Văn A"
                                            maxLength={100}
                                            onBlur={(e) => {
                                                const trimmedValue = trimWhitespace(e);
                                                form.setFieldsValue({ name: trimmedValue });
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="phone"
                                        label="Số Điện Thoại"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại.' },
                                            {
                                                pattern: /^[0-9]{10}$/,
                                                message: 'Số điện thoại phải gồm 10 chữ số và không chứa ký tự đặc biệt.'
                                            },
                                            {
                                                validator: (_, value) =>
                                                    value && value.trim() === value
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error('Không được chứa khoảng trắng ở đầu hoặc cuối.'))
                                            }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="0987654321"
                                            maxLength={10}
                                            onBlur={(e) => {
                                                const trimmedValue = trimWhitespace(e);
                                                form.setFieldsValue({ phone: trimmedValue });
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email.' },
                                            { type: 'email', message: 'Định dạng email không hợp lệ.' },
                                            { max: 50, message: 'Email không được vượt quá 50 ký tự.' },
                                            {
                                                validator: (_, value) =>
                                                    value && value.trim() === value
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error('Không được chứa khoảng trắng ở đầu hoặc cuối.'))
                                            }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input
                                            placeholder="vidu@email.com"
                                            type="email"
                                            maxLength={50}
                                            onBlur={(e) => {
                                                const trimmedValue = trimWhitespace(e);
                                                form.setFieldsValue({ email: trimmedValue });
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="province"
                                        label="Tỉnh/Thành Phố"
                                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố.' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Select
                                            placeholder="Chọn tỉnh/thành phố"
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
                                        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện.' }]}
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
                                        rules={[{ required: true, message: 'Vui lòng chọn phường/xã.' }]}
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
                                        label="Địa Chỉ"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập địa chỉ.' },
                                            { validator: validateAddress }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input
                                            prefix={<EnvironmentOutlined />}
                                            placeholder="Số nhà, tên đường"
                                            onBlur={(e) => {
                                                const trimmedValue = e.target.value.trim();
                                                form.setFieldsValue({ address: trimmedValue });
                                            }}
                                            onChange={(e) => {
                                                const cleanedValue = e.target.value.replace(/\s+/g, ' ');
                                                if (cleanedValue !== e.target.value) {
                                                    form.setFieldsValue({ address: cleanedValue });
                                                }
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item name="note" label="Ghi Chú" style={{ marginBottom: 16 }}>
                                        <TextArea rows={2} placeholder="Ghi chú cho đơn hàng..." style={{ resize: 'none' }} />
                                    </Form.Item>

                                    <Divider orientation="left" style={{ marginTop: 0 }}>Phương Thức Thanh Toán</Divider>

                                    <Form.Item
                                        name="paymentMethod"
                                        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán.' }]}
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
                                                        <Text>Thanh toán khi nhận hàng</Text>
                                                    </Space>
                                                </Radio>
                                                <Radio value={2} style={{ whiteSpace: 'nowrap' }}>
                                                    <Space size="small">
                                                        <CreditCardOutlined />
                                                        <Text>Thanh toán qua VNPay</Text>
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
                                    Đặt Hàng
                                </Button>
                            </Space>
                        </Card>
                    </Space>
                </Col>
                <Modal
                    title="Xác Nhận Đơn Hàng"
                    visible={isConfirmModalVisible}
                    onOk={handleConfirmOk}
                    onCancel={handleConfirmCancel}
                    okText="Xác Nhận"
                    cancelText="Hủy"
                    confirmLoading={isConfirmModalLoading}
                    okButtonProps={{ disabled: isConfirmModalLoading }}
                >
                    <Text>Bạn có chắc chắn muốn đặt đơn hàng này không?</Text>
                    <Divider />
                    <Row justify="space-between">
                        <Text>Tạm tính:</Text>
                        <Text strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</Text>
                    </Row>
                    <Row justify="space-between">
                        <Text>Phí vận chuyển:</Text>
                        <Text strong>{shippingFee.toLocaleString('vi-VN')}₫</Text>
                    </Row>
                    {voucherDiscount > 0 && (
                        <Row justify="space-between">
                            <Text>Giảm giá (mã giảm giá):</Text>
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
                    title="Cảm Ơn Bạn Đã Đặt Hàng"
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
                        <Title level={4} style={{ marginBottom: 8 }}>Đơn hàng của bạn đã được nhận!</Title>
                        <Text style={{ display: 'block', marginBottom: 16 }}>
                            Mã đơn hàng: <strong>{orderCode}</strong><br />
                            Vui lòng kiểm tra email để xem chi tiết đơn hàng.
                        </Text>
                    </div>
                </Modal>
            </Row>
        </div>
    );
};

export default CartItems;