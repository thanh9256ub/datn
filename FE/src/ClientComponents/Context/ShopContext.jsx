import React, { createContext, useState, useEffect } from 'react';
import {
  apiAddToCart,
  fetchProductDetailByAttributes,
  getCartDetails,
  removeFromCartApi,
  getOrCreateCart,
  updateCartQuantity,
  checkStockAvailability,
} from '../Service/productService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import useWebSocket from '../../hook/useWebSocket';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartId, setCartId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { token, role, customerId, logout: authLogout } = useAuth();
  const isGuest = !token || role !== 'CUSTOMER';
  const { messages } = useWebSocket('/topic/product-updates');

  const syncGuestCartToServer = async (cartId) => {
    try {
      const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (guestCart.length === 0) {
        await loadCartItems(cartId);
        return;
      }

      const serverCartResponse = await getCartDetails(cartId);
      const serverCartItems = serverCartResponse.data?.length > 0 ? serverCartResponse.data[0]?.cart?.items || [] : [];
      const serverCartMap = new Map(serverCartItems.map((item) => [item.productDetailId, item]));

      const stockCheckItems = guestCart.map((item) => ({ productDetailId: item.productDetailId }));
      const stockResponse = await checkStockAvailability(stockCheckItems);

      for (const guestItem of guestCart) {
        const availableStock = stockResponse[guestItem.productDetailId] || 10;
        const maxAllowed = Math.min(10, availableStock);
        const finalQuantity = Math.min(guestItem.quantity, maxAllowed);

        if (finalQuantity !== guestItem.quantity) {
          toast.warning(
            `Số lượng ${guestItem.productDetail?.product?.productName} đã được điều chỉnh từ ${guestItem.quantity} xuống ${finalQuantity} do giới hạn tồn kho`
          );
        }

        const existingItem = serverCartMap.get(guestItem.productDetailId);
        if (existingItem) {
          const newTotalQuantity = Math.min(existingItem.quantity + finalQuantity, maxAllowed);
          await updateCartQuantity(existingItem.id, newTotalQuantity);
        } else {
          const cartData = {
            customerId: customerId,
            productDetailId: guestItem.productDetailId,
            quantity: finalQuantity,
            price: guestItem.price,
          };
          await apiAddToCart(cartData);
        }
      }

      localStorage.removeItem('cartItems');
      await loadCartItems(cartId);
    } catch (error) {
      console.error('Đồng bộ giỏ hàng thất bại:', error);
      toast.error('Không thể đồng bộ giỏ hàng. Vui lòng thử lại.');
    }
  };

  const refreshCart = async () => {
    if (isGuest) {
      setCartItems((prevItems) => {
        const updatedCart = prevItems.map(item => ({
          ...item,
          total_price: item.price * item.quantity,
        }));
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } else if (cartId) {
      await loadCartItems(cartId);
    }
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log('Received WebSocket message:', lastMessage); // Debugging

      if (lastMessage.type === 'priceUpdate') {
        const { productDetailId, newPrice } = lastMessage;
        console.log(`Processing price update for productDetailId: ${productDetailId}, newPrice: ${newPrice}`);

        setCartItems((prevItems) => {
          let priceUpdated = false;
          const updatedItems = prevItems.map((item) => {
            const itemId = item.id || item.productDetailId || item.productDetail?.id;
            if (itemId === productDetailId && item.price !== newPrice) {
              priceUpdated = true;
              console.log(`Updating item: ${itemId} with new price: ${newPrice}`);
              return {
                ...item,
                price: newPrice,
                total_price: newPrice * item.quantity, // Update total_price
                productDetail: {
                  ...item.productDetail,
                  price: newPrice,
                },
              };
            }
            return item;
          });

          // Update localStorage for guest cart if price is updated
          if (isGuest && priceUpdated) {
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            toast.info('Giá sản phẩm trong giỏ hàng đã được cập nhật!');
            console.log('Updated localStorage for guest cart:', updatedItems);
          }

          return updatedItems;
        });
      }
    }
  }, [messages, isGuest]);


  const loadCartItems = async (cartId) => {
    try {
      console.log('Đang tải giỏ hàng với cartId:', cartId);
      const response = await getCartDetails(cartId);
      console.log('Phản hồi API:', response);

      const cartDetails = response && response.data ? response.data : [];
      console.log('Chi tiết giỏ hàng:', cartDetails);

      const items = cartDetails.length > 0
        ? await Promise.all(
          (cartDetails[0]?.cart?.items || []).map(async (item) => {
            try {
              const productDetail = await fetchProductDetailByAttributes(
                item.productDetail?.product?.id,
                item.productDetail?.color?.id,
                item.productDetail?.size?.id
              );

              return {
                ...item,
                price: productDetail.price,
                total_price: item.quantity * productDetail.price
              };
            } catch (error) {
              console.error('Không thể cập nhật giá sản phẩm:', error);
              return item;
            }
          })
        )
        : [];

      setCartItems(items);

      if (cartDetails.length > 0 && cartDetails[0]?.cart?.id) {
        setCartId(cartDetails[0].cart.id);
        setSelectedItems(prevSelected =>
          prevSelected.filter(id =>
            items.some(item => item.id === id || item.productDetailId === id || item.productDetail?.id === id)
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
      toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.');
    }
  };

  const addToCart = async ({ productId, colorId, sizeId, quantity = 1 }) => {
    try {
      const productDetail = await fetchProductDetailByAttributes(productId, colorId, sizeId);
      if (!productDetail || !productDetail.id) {
        throw new Error('Không tìm thấy thông tin chi tiết sản phẩm');
      }

      const stockResponse = await checkStockAvailability([{ productDetailId: productDetail.id }]);
      const availableStock = stockResponse[productDetail.id] || 10;
      const maxAllowed = Math.min(10, availableStock);

      if (quantity > maxAllowed) {
        toast.warning(`Số lượng tối đa cho sản phẩm này là ${maxAllowed}`);
        quantity = maxAllowed;
      }

      if (isGuest) {
        setCartItems((prev) => {
          const existingItem = prev.find((item) => item.productDetailId === productDetail.id);
          let updatedCart;

          if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantity, maxAllowed);
            updatedCart = prev.map((item) =>
              item.productDetailId === productDetail.id
                ? {
                  ...item,
                  quantity: newQuantity,
                  price: productDetail.price,
                  total_price: productDetail.price * newQuantity,
                }
                : item
            );
          } else {
            const newItem = {
              productDetailId: productDetail.id,
              productDetail: productDetail,
              quantity: quantity,
              price: productDetail.price,
              total_price: productDetail.price * quantity,
            };
            updatedCart = [...prev, newItem];
          }

          localStorage.setItem('cartItems', JSON.stringify(updatedCart));
          toast.success('Đã thêm sản phẩm vào giỏ hàng!');
          return updatedCart;
        });
      } else {
        if (!cartId) {
          const cartData = await getOrCreateCart(customerId);
          setCartId(cartData.id);
        }

        const currentCart = await getCartDetails(cartId);
        const currentItems = currentCart.data?.length > 0 ? currentCart.data[0]?.cart?.items || [] : [];
        const existingItem = currentItems.find((item) => item.productDetailId === productDetail.id);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, maxAllowed);
          await updateCartQuantity(existingItem.id, newQuantity);
        } else {
          const cartData = {
            customerId: customerId,
            productDetailId: productDetail.id,
            quantity: quantity,
            price: productDetail.price,
          };
          await apiAddToCart(cartData);
        }

        await loadCartItems(cartId);
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Thêm vào giỏ hàng thất bại:', error.message);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
      throw error;
    }
  };

  const removeFromCart = async (cartDetailId) => {
    if (isGuest) {
      setCartItems((prev) => {
        const newCart = prev.filter((item) => (item.id || item.productDetailId) !== cartDetailId);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        return newCart;
      });
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

    try {
      const itemToUpdate = cartItems.find(item =>
        (item.id || item.productDetailId) === cartDetailId
      );

      if (!itemToUpdate) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      // Kiểm tra tồn kho
      const stockResponse = await checkStockAvailability([{
        productDetailId: itemToUpdate.productDetailId || itemToUpdate.productDetail?.id
      }]);
      const availableStock = stockResponse[itemToUpdate.productDetailId] || 10;
      const finalQuantity = Math.min(newQuantity, 10, availableStock);

      if (finalQuantity !== newQuantity) {
        toast.warning(`Số lượng tối đa cho sản phẩm này là ${finalQuantity}`);
      }

      if (isGuest) {
        setCartItems(prev => {
          const updatedCart = prev.map(item =>
            (item.id || item.productDetailId) === cartDetailId
              ? {
                ...item,
                quantity: finalQuantity,
                total_price: item.price * finalQuantity
              }
              : item
          );
          localStorage.setItem('cartItems', JSON.stringify(updatedCart));
          return updatedCart;
        });
      } else {
        await updateCartQuantity(itemToUpdate.id, finalQuantity);

        setCartItems(prev => prev.map(item =>
          item.id === itemToUpdate.id
            ? { ...item, quantity: finalQuantity, total_price: item.price * finalQuantity }
            : item
        ));

        await loadCartItems(cartId);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      toast.error('Không thể cập nhật số lượng sản phẩm');
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
    setCartId(null);
    setSelectedItems([]);
    setCartItems([]);
    authLogout();
  };

  const contextValue = {
    cartItems,
    setCartItems,
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
    refreshCart,
    handleLogout,
    token,
    cartId,
    setCartId,
    getOrCreateCart,
    setSelectedItems,
  };

  useEffect(() => {
    const initializeUserAndCart = async () => {
      if (token && role === 'CUSTOMER' && customerId) {
        try {
          const cartData = await getOrCreateCart(customerId);
          if (!cartData?.id) {
            throw new Error('Failed to create cart');
          }

          setCartId(cartData.id);

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
          } else {
            toast.error('Không thể khởi tạo giỏ hàng. Vui lòng thử lại.');
          }
        }
      } else if (isGuest) {
        const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(savedCart);
        setSelectedItems(savedCart.map((item) => item.productDetailId));
      }
    };

    initializeUserAndCart();
  }, [token, role, customerId, isGuest]);

  useEffect(() => {
    const loadInitialCart = async () => {
      if (isGuest) {
        const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(savedCart);
        setSelectedItems(savedCart.map((item) => item.productDetailId));
      } else if (cartId) {
        await loadCartItems(cartId);
      }
    };
    loadInitialCart();
  }, [isGuest, cartId]);

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