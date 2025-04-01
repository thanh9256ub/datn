import React, { createContext, useState, useEffect } from 'react';
import {
    apiAddToCart,
    fetchProductDetailByAttributes,
    getCartDetails,
    removeFromCartApi,
    getOrCreateCart,
    updateCartQuantity,
    getTokenCustomer,
    fetchCustomerProfile,
} from '../Service/productService';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isGuest, setIsGuest] = useState(true);
    const [customerId, setCustomerId] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Hàm đăng nhập
    const login = async ({ email, password }) => {
        try {
            const response = await getTokenCustomer(email, password);
            console.log('Full response:', response);

            // Kiểm tra dữ liệu trả về từ API
            if (!response || !response.data || !response.data.token) {
                throw new Error('Không nhận được token từ server');
            }

            const newToken = response.data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);

            const profile = await fetchCustomerProfile(newToken);
            if (!profile || !profile.customerId) {
                throw new Error('Không lấy được thông tin khách hàng');
            }

            const newCustomerId = profile.customerId;
            setCustomerId(newCustomerId);
            setIsGuest(false);

            // Khởi tạo hoặc lấy giỏ hàng
            const cartData = await getOrCreateCart(newCustomerId);
            setCartId(cartData.id);

            // Đồng bộ giỏ hàng khách vãng lai lên server
            if (cartItems.length > 0) {
                await syncGuestCartToServer(cartData.id);
            } else {
                await loadCartItems(cartData.id);
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error.message);
            setIsGuest(true);
            setCustomerId(null);
            setToken(null);
            localStorage.removeItem('token');
            throw error; // Ném lỗi để component Login xử lý
        }
    };

    // Đồng bộ giỏ hàng khách vãng lai lên server
    const syncGuestCartToServer = async (cartId) => {
        try {
            for (const item of cartItems) {
                const cartData = {
                    customerId: customerId,
                    productDetailId: item.productDetailId,
                    quantity: item.quantity,
                    price: item.price,
                };
                await apiAddToCart(cartData);
            }
            await loadCartItems(cartId);
            localStorage.removeItem('cartItems'); // Xóa giỏ hàng local sau khi đồng bộ
        } catch (error) {
            console.error('Đồng bộ giỏ hàng thất bại:', error);
        }
    };

    useEffect(() => {
        if (isGuest) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isGuest]);

    const loadCartItems = async (cartId) => {
        try {
            console.log('Loading cart with cartId:', cartId);
            const response = await getCartDetails(cartId);
            console.log('API response:', response);

            // Kiểm tra response có hợp lệ không
            const cartDetails = response && response.data ? response.data : [];
            console.log('Cart details:', cartDetails);

            // Nếu không có dữ liệu, giữ nguyên mảng rỗng
            const items = cartDetails.length > 0 ? cartDetails[0]?.cart?.items || [] : [];
            console.log('Extracted cart items:', items);

            setCartItems(items);

            if (cartDetails.length > 0 && cartDetails[0]?.cart?.id) {
                setCartId(cartDetails[0].cart.id);
                setSelectedItems(items.map((item) => item.id || item.productDetailId));
            } else {
                setSelectedItems([]);
                console.log('No cart data found for cartId:', cartId);
            }
        } catch (error) {
            console.error('Tải giỏ hàng thất bại:', error);
            setCartItems([]);
            setSelectedItems([]);
        }
    };

    const addToCart = async ({ productId, colorId, sizeId, quantity = 1 }) => {
        try {
            const productDetail = await fetchProductDetailByAttributes(productId, colorId, sizeId);
            if (!productDetail || !productDetail.id) {
                throw new Error('Không tìm thấy thông tin chi tiết sản phẩm');
            }

            if (isGuest) {
                setCartItems((prev) => {
                    const existingItem = prev.find((item) => item.productDetailId === productDetail.id);
                    if (existingItem) {
                        return prev.map((item) =>
                            item.productDetailId === productDetail.id
                                ? { ...item, quantity: item.quantity + quantity, total_price: item.price * (item.quantity + quantity) }
                                : item
                        );
                    }
                    const newItem = {
                        productDetailId: productDetail.id,
                        productDetail: productDetail,
                        quantity: quantity,
                        price: productDetail.price,
                        total_price: productDetail.price * quantity,
                    };
                    return [...prev, newItem];
                });
            } else {
                if (!cartId) {
                    throw new Error('Không có cartId để thêm sản phẩm');
                }
                const cartData = {
                    customerId: customerId,
                    productDetailId: productDetail.id,
                    quantity: quantity,
                    price: productDetail.price,
                };
                await apiAddToCart(cartData);
                await loadCartItems(cartId); // Cập nhật lại giỏ hàng sau khi thêm
            }
        } catch (error) {
            console.error('Thêm vào giỏ hàng thất bại:', error.message);
            throw error;
        }
    };

    const removeFromCart = async (cartDetailId) => {
        if (isGuest) {
            setCartItems((prev) => prev.filter((item) => (item.id || item.productDetailId) !== cartDetailId));
            setSelectedItems((prev) => prev.filter((id) => id !== cartDetailId));
        } else {
            await removeFromCartApi(cartDetailId);
            await loadCartItems(cartId);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setSelectedItems([]);
        if (isGuest) {
            localStorage.removeItem('cartItems');
        }
    };

    const updateQuantity = async (cartDetailId, newQuantity) => {
        if (newQuantity < 1) return;
        if (isGuest) {
            setCartItems((prev) =>
                prev.map((item) =>
                    (item.id || item.productDetailId) === cartDetailId
                        ? { ...item, quantity: newQuantity, total_price: item.price * newQuantity }
                        : item
                )
            );
        } else {
            await updateCartQuantity(cartDetailId, newQuantity);
            await loadCartItems(cartId);
        }
    };

    const toggleItemSelection = (cartDetailId) => {
        setSelectedItems((prev) =>
            prev.includes(cartDetailId) ? prev.filter((id) => id !== cartDetailId) : [...prev, cartDetailId]
        );
    };

    const getTotalCartAmount = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.id || item.productDetailId))
            .reduce((total, item) => total + (item.total_price || item.price * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleLogout = () => {
        setIsGuest(true);
        setCustomerId(null);
        setCartId(null);
        setSelectedItems([]);
        setCartItems([]);
        setToken(null);
        localStorage.removeItem('token');
    };

    const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
        loadCartItems,
        updateQuantity,
        toggleItemSelection,
        selectedItems,
        isGuest,
        customerId,
        login,
        handleLogout,
    };

    useEffect(() => {
        const initializeUser = async () => {
            if (token && isGuest) {
                try {
                    const profile = await fetchCustomerProfile(token);
                    setCustomerId(profile.customerId);
                    setIsGuest(false);
                    const cartData = await getOrCreateCart(profile.customerId);
                    console.log('Cart data from getOrCreateCart:', cartData);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } catch (error) {
                    console.error('Không thể xác thực token:', error);
                    handleLogout();
                }
            }
        };
        initializeUser();
    }, [token]); // Chỉ phụ thuộc vào token

    useEffect(() => {
        if (!isGuest && customerId && !cartId) {
            const initializeCart = async () => {
                try {
                    const cartData = await getOrCreateCart(customerId);
                    console.log('Cart data from initializeCart:', cartData);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } catch (error) {
                    console.error('Khởi tạo giỏ hàng thất bại:', error);
                }
            };
            initializeCart();
        }
    }, [isGuest, customerId, cartId])

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;