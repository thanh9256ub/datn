import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './CartItems.css';
import { ShopContext } from '../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { clearCart, getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [shippingFee, setShippingFee] = useState(0);  
    const VIETTELPOST_API_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJVc2VySWQiOjE1ODQwNzAxLCJGcm9tU291cmNlIjo1LCJUb2tlbiI6Ik1HT0U0WEJLRTBXUDBKOFZYIiwiZXhwIjoxNzQxMjQ1MjkzLCJQYXJ0bmVyIjoxNTg0MDcwMX0.JNB0q9-06-6kSz4XcpEF8PnJBkzJt06vGEeocw0a7XBrQFcgpn937TequZDQArdyKZ5eXUDaYXJw-dH-UqS8Wg'; // Thay thế bằng API key của bạn

    useEffect(() => {
        // Lấy danh sách tỉnh/thành phố
        axios.get('https://partner.viettelpost.vn/v2/categories/listProvince', {
            headers: {
                'Token': VIETTELPOST_API_KEY
            }
        })
            .then(response => {
                console.log('Provinces:', response.data.data); // Log dữ liệu để kiểm tra
                setProvinces(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            // Lấy danh sách quận/huyện
            axios.get(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${selectedProvince}`, {
                headers: {
                    'Token': VIETTELPOST_API_KEY
                }
            })
                .then(response => {
                    console.log('Districts:', response.data.data); // Log dữ liệu để kiểm tra
                    setDistricts(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching districts:', error);
                });
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            // Lấy danh sách phường/xã
            axios.get(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${selectedDistrict}`, {
                headers: {
                    'Token': VIETTELPOST_API_KEY
                }
            })
                .then(response => {
                    console.log('Wards:', response.data.data); // Log dữ liệu để kiểm tra
                    setWards(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching wards:', error);
                });
        }
    }, [selectedDistrict]);
    const calculateShippingFee = async () => {
        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            alert("Vui lòng chọn đầy đủ địa chỉ.");
            return;
        }
    
        const payload = {
            "PRODUCT_PRICE": getTotalCartAmount(),
            "MONEY_COLLECTION": getTotalCartAmount(),
            "ORDER_SERVICE_ADD": "1",
            "ORDER_SERVICE": "3",
            "SENDER_PROVINCE": selectedProvince,
            "SENDER_DISTRICT": selectedDistrict,
            "RECEIVER_PROVINCE": selectedProvince,
            "RECEIVER_DISTRICT": selectedDistrict,
            "RECEIVER_WARDS": selectedWard,
            "PRODUCT_WEIGHT": 1000, // Trọng lượng sản phẩm (gram)
            "PRODUCT_TYPE": "HH" // Loại hàng hóa
        };
    
        try {
            const response = await axios.post('https://partner.viettelpost.vn/v2/order/getPrice', payload, {
                headers: {
                    'Token': VIETTELPOST_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.data && response.data.data) {
                setShippingFee(response.data.data.TOTAL);
            } else {
                console.error('Không thể tính phí vận chuyển.');
            }
        } catch (error) {
            console.error('Lỗi khi tính phí vận chuyển:', error);
        }
    };
    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedWard) {
            calculateShippingFee();
        }
    }, [selectedProvince, selectedDistrict, selectedWard]);
    const handleCheckout = () => {
        if (getTotalCartAmount() === 0) {
            alert("Your cart is empty!");
            return;
        }
        setOrderSuccess(true);
        clearCart(); // Reset giỏ hàng về rỗng
    };

    const handleCheckboxChange = (productId) => {
        setSelectedItems((prevState) => {
            if (prevState.includes(productId)) {
                return prevState.filter(id => id !== productId); // Remove if already selected
            }
            return [...prevState, productId]; // Add if not selected
        });
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity >= 1) { // Đảm bảo rằng số lượng không nhỏ hơn 1
            setSelectedItems(prevState => {
                return prevState.map(item => item === productId ? quantity : item);
            });
            // Cập nhật lại số lượng sản phẩm trong giỏ hàng
            cartItems[productId] = quantity;
        }
    };

    return (
        <div className='cartitems'>
            {orderSuccess ? (
                <div className="order-success">
                    <h2>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm.</p>
                </div>
            ) : (
                <>
                    <div className="cartitems-format-main">
                        <p>Products</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>
                    <hr />
                    {all_product.map((e) => {
                        if (cartItems[e.id] > 0) {
                            return (
                                <div key={e.id}>
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${e.id}`}
                                        className="cart-checkbox"
                                        checked={selectedItems.includes(e.id)}
                                        onChange={() => handleCheckboxChange(e.id)}
                                    />
                                    <label htmlFor={`checkbox-${e.id}`} className="checkbox-label"></label>
                                    <div className="cartitems-format cartitems-format-main">
                                        <img src={e.image} alt="" className='carticon-product-icon' />
                                        <p>{e.name}</p>
                                        <p>${e.new_price}</p>
                                        <div>
                                            <button className="quantity-button increase" onClick={() => handleQuantityChange(e.id, cartItems[e.id] + 1)}>+</button>
                                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                            <button className="quantity-button decrease" onClick={() => handleQuantityChange(e.id, cartItems[e.id] - 1)}>-</button>
                                        </div>
                                        <p>${e.new_price * cartItems[e.id]}</p>
                                        <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeFromCart(e.id)} alt="" />
                                    </div>
                                    <hr />
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div className="cartitems-down">
                        <div className="cartitems-total">
                            <h1>Cart Totals</h1>
                            <div>
                                <div className="cartitems-total-item">
                                    <p>Subtotal</p>
                                    <p>${getTotalCartAmount()} </p>
                                </div>
                                <hr />
                                <div className="cartitems-total-item">
                                    <p>Shipping fee</p>
                                    <p>Free</p>
                                </div>
                                <hr />
                                <div className="cartitems-total-item">
                                    <p>Total</p>
                                    <p>${getTotalCartAmount()}</p>
                                </div>
                            </div>
                            <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                        </div>
                        <div className="cartitems-promocode">
                            <p>If you have a promo code, Enter it here</p>
                            <div className="cartitems-promobox">
                                <input type="text" placeholder='Promo Code' />
                                <button>Submit</button>
                            </div>
                            <h2>Customer Information</h2>
                            <div className="cartitems-customer-info">
                                <input type="text" name="name" placeholder="Full Name" />
                                <input type="text" name="phone" placeholder="Phone Number" />
                                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map(province => (
                                        <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>
                                            {province.PROVINCE_NAME}
                                        </option>
                                    ))}
                                </select>

                                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map(district => (
                                        <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>
                                            {district.DISTRICT_NAME}
                                        </option>
                                    ))}
                                </select>

                                <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map(ward => (
                                        <option key={ward.WARDS_ID} value={ward.WARDS_ID}>
                                            {ward.WARDS_NAME}
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="address" placeholder="Detailed Address" />
                            </div>
                            <h2>Payment Method</h2>
                            <div className="cartitems-payment-method">
                                <label>
                                    <input type="radio" name="payment" value="cod" /> <span>Cash on Delivery</span>
                                </label>
                                <label>
                                    <input type="radio" name="payment" value="bank_transfer" /> <span>Bank Transfer</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartItems;