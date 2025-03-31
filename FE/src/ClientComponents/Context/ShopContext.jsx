import React, { createContext, useState, useEffect } from 'react';
import { apiAddToCart, fetchProductDetailByAttributes } from '../Service/productService';
import axios from 'axios';

// Tạo context
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const addToCart = async ({ productId, colorId, sizeId, quantity = 1 }) => {
        try {
            const productDetail = await fetchProductDetailByAttributes(productId, colorId, sizeId);
            if (!productDetail || !productDetail.id) {
                throw new Error("Không tìm thấy thông tin chi tiết sản phẩm");
            }

            const cartData = {
                customerId: 2, // Thay bằng ID user thực tế, lấy từ auth context nếu có
                productDetailId: productDetail.id,
                quantity: quantity,
                price: productDetail.price
            };

            console.log("Sending cart data:", cartData);
            const response = await apiAddToCart(cartData);

            // Cập nhật cartItems với dữ liệu từ response
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
                    id: response.data.id,
                    productDetailId: productDetail.id,
                    productDetail: productDetail,
                    quantity: quantity,
                    price: productDetail.price,
                    total_price: productDetail.price * quantity
                }];
            });

            return response;
        } catch (error) {
            console.error("Add to cart failed:", error);
            throw error;
        }
    };
    const removeFromCart = async (cartDetailId) => {
        try {
            await api.delete(`/cart-details/${cartDetailId}`);
            setCartItems(prev => prev.filter(item => item.id !== cartDetailId));
        } catch (error) {
            console.error("Remove from cart failed:", error);
            throw error;
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => total + (item.total_price || item.price * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const loadCartItems = async (customerId) => {
        try {
            const response = await api.get(`/cart-details/cart/${customerId}`);
            setCartItems(response.data.data || []);
        } catch (error) {
            console.error("Load cart items failed:", error);
        }
    };

    const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
        loadCartItems
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;