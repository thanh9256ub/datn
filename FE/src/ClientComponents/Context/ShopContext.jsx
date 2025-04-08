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
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    // const [isGuest, setIsGuest] = useState(true);
    // const [customerId, setCustomerId] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    // const [tokenClient, setTokenClient] = useState(localStorage.getItem('tokenClient') || null);
    const { token, role, customerId, logout: authLogout } = useAuth();
    const isGuest = !token || role !== 'CUSTOMER';

    // Đồng bộ giỏ hàng khách vãng lai lên server
    const syncGuestCartToServer = async (cartId) => {
        try {
            const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            
            // Kiểm tra xem có giỏ hàng guest không
            if (guestCart.length === 0) {
                await loadCartItems(cartId);
                return;
            }
    
            // Lấy giỏ hàng hiện tại từ server
            const serverCartResponse = await getCartDetails(cartId);
            const serverCartItems = serverCartResponse.data?.length > 0 ? serverCartResponse.data[0]?.cart?.items || [] : [];
            
            // Tạo bản đồ sản phẩm từ server cart để kiểm tra nhanh
            const serverCartMap = new Map();
            serverCartItems.forEach(item => {
                serverCartMap.set(item.productDetailId, item);
            });
    
            // Duyệt qua giỏ hàng guest và merge vào server cart
            for (const guestItem of guestCart) {
                const existingItem = serverCartMap.get(guestItem.productDetailId);
                
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    await updateCartQuantity(
                        existingItem.id, 
                        existingItem.quantity + guestItem.quantity
                    );
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    const cartData = {
                        customerId: customerId,
                        productDetailId: guestItem.productDetailId,
                        quantity: guestItem.quantity,
                        price: guestItem.price,
                    };
                    await apiAddToCart(cartData);
                }
            }
    
            // Sau khi đồng bộ xong, tải lại giỏ hàng từ server
            await loadCartItems(cartId);
            localStorage.removeItem('cartItems');
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
          console.log('Đang tải giỏ hàng với cartId:', cartId);
          const response = await getCartDetails(cartId);
          console.log('Phản hồi API:', response);
      
          const cartDetails = response && response.data ? response.data : [];
          console.log('Chi tiết giỏ hàng:', cartDetails);
      
          const items = cartDetails.length > 0 ? cartDetails[0]?.cart?.items || [] : [];
          console.log('Các mục trong giỏ hàng đã trích xuất:', items);
      
          setCartItems(items);
      
          if (cartDetails.length > 0 && cartDetails[0]?.cart?.id) {
            setCartId(cartDetails[0].cart.id);
            setSelectedItems(prevSelected => 
              prevSelected.filter(id => 
                items.some(item => (item.id === id || item.productDetailId === id || item.productDetail?.id === id))
              )
            );
          } else {
            setSelectedItems([]);
            console.log('Không tìm thấy dữ liệu giỏ hàng cho cartId:', cartId);
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
                    const existingItem = prev.find((item) => 
                        item.productDetailId === productDetail.id
                    );
                    if (existingItem) {
                        return prev.map((item) =>
                            item.productDetailId === productDetail.id
                                ? { 
                                    ...item, 
                                    quantity: item.quantity + quantity, 
                                    total_price: item.price * (item.quantity + quantity) 
                                }
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
                    const cartData = await getOrCreateCart(customerId);
                    setCartId(cartData.id);
                }
    
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const currentCart = await getCartDetails(cartId);
                const currentItems = currentCart.data?.length > 0 ? currentCart.data[0]?.cart?.items || [] : [];
                const existingItem = currentItems.find(item => 
                    item.productDetailId === productDetail.id
                );
    
                if (existingItem) {
                    // Cập nhật số lượng nếu đã tồn tại
                    await updateCartQuantity(
                        existingItem.id, 
                        existingItem.quantity + quantity
                    );
                } else {
                    // Thêm mới nếu chưa tồn tại
                    const cartData = {
                        customerId: customerId,
                        productDetailId: productDetail.id,
                        quantity: quantity,
                        price: productDetail.price,
                    };
                    await apiAddToCart(cartData);
                }
                
                await loadCartItems(cartId);
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
            prev.includes(cartDetailId) 
                ? prev.filter((id) => id !== cartDetailId) 
                : [...prev, cartDetailId]
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
        // setIsGuest(true);
        // setCustomerId(null);
        setCartId(null);
        setSelectedItems([]);
        setCartItems([]);
        // setTokenClient(null);
        // localStorage.removeItem('tokenClient');
        authLogout()
    };

    const contextValue = {
        cartItems,
        setCartItems, // Thêm setCartItems vào context
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
        // login,
        handleLogout,
        token,
        cartId,
        setCartId,
        getOrCreateCart,
        setSelectedItems
    };

    // useEffect(() => {
    //     const initializeUser = async () => {
    //         if (tokenClient) {
    //             try {
    //                 const profile = await fetchCustomerProfile(tokenClient);
    //                 setCustomerId(profile.customerId);
    //                 setIsGuest(false);

    //                 // Lấy hoặc tạo cartId ngay lập tức
    //                 const cartData = await getOrCreateCart(profile.customerId);
    //                 console.log('Cart data from getOrCreateCart:', cartData);
    //                 setCartId(cartData.id);

    //                 // Tải giỏ hàng với cartId vừa nhận được
    //                 await loadCartItems(cartData.id);
    //             } catch (error) {
    //                 console.error('Không thể xác thực token:', error);
    //                 handleLogout();
    //             }
    //         }
    //     };
    //     initializeUser();
    // }, [tokenClient]); // Chỉ phụ thuộc vào token
    useEffect(() => {
        const initializeUserAndCart = async () => {
            if (token && role === 'CUSTOMER' && customerId) {
                try {
                    // Tạo giỏ hàng
                    const cartData = await getOrCreateCart(customerId);
                    if (!cartData?.id) {
                        throw new Error('Failed to create cart');
                    }
    
                    setCartId(cartData.id);
    
                    // Đồng bộ giỏ hàng từ localStorage lên server nếu có
                    const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
                    if (guestCart.length > 0) {
                        await syncGuestCartToServer(cartData.id);
                    } else {
                        await loadCartItems(cartData.id);
                    }
                } catch (error) {
                    console.error('Initialization error:', error);
                    if (error.response?.status === 401) {
                        authLogout();
                    }
                }
            }
        };
    
        if (token) {
            initializeUserAndCart();
        }
    }, [token, role, customerId]);

    // useEffect(() => {
    //     if (!isGuest && customerId && !cartId) {
    //         const initializeCart = async () => {
    //             try {
    //                 const cartData = await getOrCreateCart(customerId);
    //                 console.log('Cart data from initializeCart:', cartData);
    //                 setCartId(cartData.id);
    //                 await loadCartItems(cartData.id);
    //             } catch (error) {
    //                 console.error('Khởi tạo giỏ hàng thất bại:', error);
    //             }
    //         };
    //         initializeCart();
    //     }
    // }, [isGuest, customerId, cartId]);
    useEffect(() => {
        if (customerId && !cartId && role === 'CUSTOMER') {
            const initializeCart = async () => {
                try {
                    const cartData = await getOrCreateCart(customerId);
                    setCartId(cartData.id);
                    await loadCartItems(cartData.id);
                } catch (error) {
                    console.error('Khởi tạo giỏ hàng thất bại:', error);
                }
            };
            initializeCart();
        }
    }, [customerId, cartId, role]);

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;