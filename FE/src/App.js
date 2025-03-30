import React, { Component } from 'react';
import logo from './logo.svg';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Admin from './admin/Admin.js';
import Client from './ClientComponents/Client.js';
import LoginNhanVien from './loginBanHang/LoginNhanVien.js';
import DoiMatKhau from './loginBanHang/DoiMatKhau.js';
import QuenMatKhau from './loginBanHang/QuenMatKhau.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Switch>

          <Route path="/admin" component={Admin} />

          <Route path="/login-nhan-vien" component={LoginNhanVien} />

          <Route path="/doi-mat-khau" component={DoiMatKhau} />

          <Route path="/quen-mat-khau" component={QuenMatKhau} />

          <Route path="/" component={Client} />

          <Redirect to="/" />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;