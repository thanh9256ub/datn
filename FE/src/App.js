import React, { Component } from 'react';
import logo from './logo.svg';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Admin from './admin/Admin.js';
import Client from './ClientComponents/Client.js';
import LoginNhanVien from './loginBanHang/LoginNhanVien.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Switch>

          <Route path="/admin" component={Admin} />

          <Route path="/login-nhan-vien" component={LoginNhanVien} />

          <Route path="/" component={Client} />

          <Redirect to="/" />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
