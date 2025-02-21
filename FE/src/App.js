import React from 'react';
import logo from './logo.svg';
import './admin/App.scss';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Admin from './admin/Admin.js';
import Client from './ClientComponents/Client.js';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Client} />


          {/* <Route path="/banhang" component={BanHang} />
          <Route path="/sanpham" component={SanPham} />
          <Route path="/nhanvien" component={NhanVien} />
          <Route path="/khachhang" component={KhachHang} />
          <Route path="/donhang" component={DonHang} /> */}

          {/* Route riêng cho Admin */}
          <Route path="/admin" component={Admin} />
          <Redirect path="/" />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
