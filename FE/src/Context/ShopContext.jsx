import React, { createContext, useState } from 'react'
import all_product from "../ClientComponents/Assets/all_product"
import { Toast } from 'bootstrap';
export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < all_product.length + 1; index++) {
        cart[index] = 0;
    }
    return cart;
}
const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());


    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        console.log(cartItems);

    }
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {  // Kiểm tra nếu itemInfo tồn tại
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount; // Chỉ return sau khi đã tính tổng cho toàn bộ sản phẩm
    };
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem;
    }

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart }
    return (
        <ShopContext.Provider value={contextValue}>
            {
                props.children
            }
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;