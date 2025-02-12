import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import ProductTable from './components/ProductTable';
import CartTable from './components/CartTable';
import OrderTable from './components/OrderTable';
import PaymentForm from './components/PaymentForm';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import productsData from './data/products.json';
import ordersData from './data/orders.json';
import cartData from './data/cart.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [products, setProducts] = useState(productsData);
    const [orders, setOrders] = useState(ordersData);
    const [cartItems, setCartItems] = useState(cartData);
    const [customer, setCustomer] = useState({ ho_ten: "Khách hàng" }); // Dữ liệu khách hàng giả
    const [order, setOrder] = useState({ id: 1 }); // Dữ liệu đơn hàng giả
    const [total, setTotal] = useState(600000); // Tổng tiền giả
    const [message, setMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCartItem, setSelectedCartItem] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [soLuong, setSoLuong] = useState(1);
    const [soLuong2, setSoLuong2] = useState(0);

    const handleTimKhachHang = (e) => {
        e.preventDefault();
        setMessage("Tính năng này chưa được hỗ trợ với dữ liệu giả.");
    };

    const handleTaoHoaDon = () => {
        setMessage("Tính năng này chưa được hỗ trợ với dữ liệu giả.");
    };

    const handleThemVaoGio = () => {
        const newCartItem = {
            id: cartItems.length + 1,
            ctsp: { san_pham: selectedProduct },
            gia_ban: selectedProduct.gia_ban,
            so_luong_mua: soLuong,
            tong_tien: selectedProduct.gia_ban * soLuong
        };
        setCartItems([...cartItems, newCartItem]);
        setShowProductModal(false);
    };

    const handleSuaGioHang = () => {
        const updatedCartItems = cartItems.map(item =>
            item.id === selectedCartItem.id ? { ...item, so_luong_mua: soLuong2, tong_tien: item.gia_ban * soLuong2 } : item
        );
        setCartItems(updatedCartItems);
        setShowCartModal(false);
    };

    const handleThanhToan = () => {
        setMessage("Tính năng này chưa được hỗ trợ với dữ liệu giả.");
    };

    const openChonSanPhamModal = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
        setSoLuong(1);
    };

    const closeChonSanPhamModal = () => {
        setShowProductModal(false);
    };

    const openChonSanPhamModal2 = (cartItem) => {
        setSelectedCartItem(cartItem);
        setShowCartModal(true);
        setSoLuong2(cartItem.so_luong_mua);
    };

    const closeChonSanPhamModal2 = () => {
        setShowCartModal(false);
    };

    return (
        <div>
            <Menu />
            <div className="container">
                <h1 className="text-center mb-4">Bán hàng</h1>
                <div className="row">
                    <div className="col-md-8">
                        <ProductTable products={products} onSelect={openChonSanPhamModal} />
                        <CartTable cartItems={cartItems} onEdit={openChonSanPhamModal2} />
                    </div>
                    <div className="col-md-4">
                        <OrderTable orders={orders} />
                        <PaymentForm
                            customer={customer}
                            order={order}
                            total={total}
                            message={message}
                            onSubmit={handleThanhToan}
                            onTimKhachHang={handleTimKhachHang}
                            onTaoHoaDon={handleTaoHoaDon}
                            setCustomer={setCustomer}
                        />
                    </div>
                </div>

                {/* Modals */}
                <ProductModal
                    product={selectedProduct}
                    show={showProductModal}
                    onClose={closeChonSanPhamModal}
                    onSave={handleThemVaoGio}
                    soLuong={soLuong}
                    setSoLuong={setSoLuong}
                />
                <CartModal
                    item={selectedCartItem}
                    show={showCartModal}
                    onClose={closeChonSanPhamModal2}
                    onSave={handleSuaGioHang}
                    soLuong2={soLuong2}
                    setSoLuong2={setSoLuong2}
                />
            </div>
        </div>
    );
};

export default App;