import React from 'react';
import logo from './logo.svg';
import './admin/App.scss';
import Navbar from './ClientComponents/Navbar/Navbar';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
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
import Admin from './admin/Admin.js'
import AppRoutes from './admin/AppRoutes.js';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          {/* <Route path="/*" exact>
            <Navbar />
            <Switch>
              <Route path='/' component={Shop} />
              <Route path='/mens' component={() => <ShopCategory banner={men_banner} category="men" />} />
              <Route path='/womens' component={() => <ShopCategory banner={women_banner} category="women" />} />
              <Route path='/kids' component={() => <ShopCategory banner={kid_banner} category="kid" />} />
              <Route path="/product" component={Product}>
                <Route path=':productID' component={Product} />
              </Route>
              <Route path='/cart' component={Cart} />
              <Route path='/login' component={LoginSignup} />
            </Switch>
            <Footer />
          </Route> */}

          {/* Route riêng cho Admin */}
          {/* <Route path="/banhang" component={BanHang} />
          <Route path="/sanpham" component={SanPham} />
          <Route path="/nhanvien" component={NhanVien} />
          <Route path="/khachhang" component={KhachHang} />
          <Route path="/donhang" component={DonHang} /> */}

          <Route path="/admin" component={Admin} />
          <Route path="/" component={Admin} />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
