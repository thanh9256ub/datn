import logo from './logo.svg';
import './App.css';
import Navbar from './ClientComponents/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './ClientComponents/Pages/LoginSignup.js';
import Shop from './ClientComponents/Pages/Shop.js';
import ShopCategory from './ClientComponents/Pages/ShopCategory.jsx';
import Product from './ClientComponents/Pages/Product.jsx';
import Cart from './ClientComponents/Pages/Cart.jsx';
import { Carousel } from 'bootstrap';
import Footer from './ClientComponents/Footer/Footer';
import men_banner from './ClientComponents/Assets/shoes_banner1.png'
import women_banner from './ClientComponents/Assets/shoes_banner2.png'
import kid_banner from './ClientComponents/Assets/shoes_banner3.png'
import all_banner from './ClientComponents/Assets/shoes_banner4.png'
import BanHang from './ClientComponents/Pages/BanHang.js';
import SanPham from './ClientComponents/Pages/SanPham.js';
import KhachHang from './ClientComponents/Pages/KhachHang.js';
import DonHang from './ClientComponents/Pages/DonHang.js';
import NhanVien from './ClientComponents/Pages/NhanVien.js';
import Admin from './admin/layouts/Admin.js'
import ShopAllProduct from './ClientComponents/Pages/ShopAllProduct.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Các route dành cho người dùng */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path='/' element={<Shop />} />
                  <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
                  <Route path='/all' element={<ShopAllProduct banner={all_banner} />} />
                  <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
                  <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
                  <Route path="/product" element={<Product />}>
                    <Route path=':productID' element={<Product />} />
                  </Route>
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/login' element={<LoginSignup />} />

                </Routes>
                <Footer />
              </>
            }
          />

          {/* Route riêng cho Admin */}

          <Route path="/banhang" element={<BanHang />} />
          <Route path="/sanpham" element={<SanPham />} />
          <Route path="/nhanvien" element={<NhanVien />} />
          <Route path="/khachhang" element={<KhachHang />} />
          <Route path="/donhang" element={<DonHang />} />

          <Route path="/admin/*" element={<Admin />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
