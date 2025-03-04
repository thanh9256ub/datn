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

    const GHN_API_KEY = '77a508c5-f919-11ef-91ea-021c91d80158'; // Thay thế bằng API key của bạn

    useEffect(() => {
        // Lấy danh sách tỉnh/thành phố
        axios.get('https://cors-anywhere.herokuapp.com/https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: {
                'Token': GHN_API_KEY
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
            axios.get(`https://cors-anywhere.herokuapp.com/https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvince}`, {
                headers: {
                    'Token': GHN_API_KEY
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
            axios.get(`https://cors-anywhere.herokuapp.com/https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrict}`, {
                headers: {
                    'Token': GHN_API_KEY
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
                                        <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                    ))}
                                </select>

                                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map(district => (
                                        <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                    ))}
                                </select>

                                <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map(ward => (
                                        <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
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