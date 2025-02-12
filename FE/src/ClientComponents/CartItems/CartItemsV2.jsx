import React, { useContext, useState, useEffect } from 'react'
import './CartItemsV2.css'
import { ShopContext } from '../../Context/ShopContext'
import axios from 'axios'
import remove_icon from '../Assets/cart_cross_icon.png'
const CartItems = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        address: '',
    });
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=1")
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
    }, []);

    const handleProvinceChange = (event) => {
        const provinceCode = event.target.value;
        setCustomerInfo({ ...customerInfo, city: provinceCode, district: "", ward: "" });
        setDistricts([]);
        setWards([]);

        axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(response => setDistricts(response.data.districts))
            .catch(error => console.error("Lỗi lấy quận/huyện:", error));
    };

    const handleDistrictChange = (event) => {
        const districtCode = event.target.value;
        setCustomerInfo({ ...customerInfo, district: districtCode, ward: "" });
        setWards([]);

        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then(response => setWards(response.data.wards))
            .catch(error => console.error("Lỗi lấy phường/xã:", error));
    };

    const handleChange = (e) => {
        setCustomerInfo({
            ...customerInfo,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <div className='cartitems'>
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
                        <div>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                            </div>
                            <hr />

                        </div>)
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
                            <p>Shiping fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Total</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                    </div>
                    <h2>Customer Information</h2>
                    <div className="cartitems-customer-info">
                        <input type="text" name="name" placeholder="Full Name" value={customerInfo.name} onChange={handleChange} />
                        <input type="text" name="phone" placeholder="Phone Number" value={customerInfo.phone} onChange={handleChange} />

                        <select name="city" value={customerInfo.city} onChange={handleProvinceChange}>
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {provinces.map(province => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>

                        <select name="district" value={customerInfo.district} onChange={handleDistrictChange} disabled={!customerInfo.city}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map(district => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        <select name="ward" value={customerInfo.ward} onChange={handleChange} disabled={!customerInfo.district}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map(ward => (
                                <option key={ward.code} value={ward.name}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>

                        <input type="text" name="address" placeholder="Detailed Address" value={customerInfo.address} onChange={handleChange} />
                    </div>
                    <button>PROOEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='Promo Code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems