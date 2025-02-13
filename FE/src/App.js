import logo from './logo.svg';
import './App.css';
import Navbar from './ClientComponents/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import { Carousel } from 'bootstrap';
import Footer from './ClientComponents/Footer/Footer';
import men_banner from './ClientComponents/Assets/banner_mens.png'
import women_banner from './ClientComponents/Assets/banner_women.png'
import kid_banner from './ClientComponents/Assets/banner_kids.png'
import BanHang from './Pages/BanHang';
import SanPham from './Pages/SanPham';
import KhachHang from './Pages/KhachHang';
import DonHang from './Pages/DonHang';
import NhanVien from './Pages/NhanVien';


function App() {
  return (
    <div>
      {/* <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
          <Route path="/product" element={<Product />}>
            <Route path=':productID' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path="/admin" element={<AdminLayout><h1>Trang Admin</h1></AdminLayout>} />
        </Routes>
        <Footer />
      </BrowserRouter> */}
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
