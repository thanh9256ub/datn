import React, { createContext, useState, useEffect } from 'react';
import {
    apiAddToCart,
    fetchProductDetailByAttributes,
    getCartDetails,
    removeFromCartApi,
    getOrCreateCart,
    updateCartQuantity
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
    const [selectedItems, setSelectedItems] = useState([]); // Thêm trạng thái cho sản phẩm được chọn

    useEffect(() => {
        if (isGuest) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isGuest]);

    const loadCartItems = async (cartId) => {
        try {
            const cartDetails = await getCartDetails(cartId);
            console.log("Loaded cart items from server:", cartDetails);
            setCartItems(cartDetails);
            if (cartDetails.length > 0 && cartDetails[0].cart?.id) {
                setCartId(cartDetails[0].cart.id);
                setSelectedItems(cartDetails.map(item => item.id || item.productDetailId)); // Chọn tất cả mặc định
            }
        } catch (error) {
            console.error("Tải giỏ hàng thất bại:", error);
            setCartItems([]);
        }
    };

    const updateQuantity = async (cartDetailId, newQuantity) => {
        if (newQuantity < 1) return;
        if (isGuest) {
            setCartItems(prev =>
                prev.map(item =>
                    (item.id || item.productDetailId) === cartDetailId
                        ? { ...item, quantity: newQuantity, total_price: item.price * newQuantity }
                        : item
                )
            );
        } else {
            try {
                await updateCartQuantity(cartDetailId, newQuantity);
                await loadCartItems(cartId);
            } catch (error) {
                console.error("Cập nhật số lượng thất bại:", error);
            }
        }
    };

    const toggleItemSelection = (cartDetailId) => {
        setSelectedItems(prev =>
            prev.includes(cartDetailId)
                ? prev.filter(id => id !== cartDetailId)
                : [...prev, cartDetailId]
        );
    };

    useEffect(() => {
        if (!isGuest && customerId) {
            const initializeCart = async () => {
                try {
                    const cartData = await getOrCreateCart(customerId);
                    const newCartId = cartData.id;
                    setCartId(newCartId);
                    await loadCartItems(newCartId);
                    if (cartItems.length > 0) {
                        await syncGuestCartToServer(newCartId);
                    }
                } catch (error) {
                    console.error("Khởi tạo giỏ hàng thất bại:", error);
                }
            };
            initializeCart();
        }
    }, [isGuest, customerId]);

    const syncGuestCartToServer = async (cartId) => {
        try {
            for (const item of cartItems) {
                const cartData = {
                    customerId: customerId,
                    productDetailId: item.productDetailId,
                    quantity: item.quantity,
                    price: item.price
                };
                await apiAddToCart(cartData);
            }
            await loadCartItems(cartId);
            localStorage.removeItem('cartItems');
        } catch (error) {
            console.error("Đồng bộ giỏ hàng thất bại:", error);
        }
    };

    const addToCart = async ({ productId, colorId, sizeId, quantity = 1 }) => {
        try {
            const productDetail = await fetchProductDetailByAttributes(productId, colorId, sizeId);
            if (!productDetail || !productDetail.id) {
                throw new Error("Không tìm thấy thông tin chi tiết sản phẩm");
            }

            if (isGuest) {
                setCartItems(prev => {
                    const existingItem = prev.find(item => item.productDetailId === productDetail.id);
                    if (existingItem) {
                        return prev.map(item =>
                            item.productDetailId === productDetail.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    }
                    return [...prev, {
                        productDetailId: productDetail.id,
                        productDetail: productDetail,
                        quantity: quantity,
                        price: productDetail.price,
                        total_price: productDetail.price * quantity
                    }];
                });
            } else {
                const cartData = {
                    customerId: customerId,
                    productDetailId: productDetail.id,
                    quantity: quantity,
                    price: productDetail.price
                };
                console.log("Sending cart data:", cartData);
                const response = await apiAddToCart(cartData);
                console.log("API Response:", response);
                await loadCartItems(cartId);
            }
        } catch (error) {
            console.error("Thêm vào giỏ hàng thất bại:", error.message);
            throw error;
        }
    };

    const removeFromCart = async (cartDetailId) => {
        if (isGuest) {
            setCartItems(prev => prev.filter(item => (item.id || item.productDetailId) !== cartDetailId));
            setSelectedItems(prev => prev.filter(id => id !== cartDetailId));
        } else {
            try {
                await removeFromCartApi(cartDetailId);
                await loadCartItems(cartId);
            } catch (error) {
                console.error("Xóa khỏi giỏ hàng thất bại:", error);
            }
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setSelectedItems([]);
        if (isGuest) {
            localStorage.removeItem('cartItems');
        }
    };

    const getTotalCartAmount = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id || item.productDetailId))
            .reduce((total, item) => total + (item.total_price || item.price * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id || item.productDetailId))
            .reduce((total, item) => total + item.quantity, 0);
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
        toggleItemSelection, // Thêm vào context
        selectedItems // Thêm vào context
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;