import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Admin from './admin/Admin.js';
import Client from './ClientComponents/Client.js';
import Login from './loginBanHang/Login.jsx';
import DoiMatKhau from './loginBanHang/DoiMatKhau.js';
import QuenMatKhau from './loginBanHang/QuenMatKhau.js';
import Signup from './loginBanHang/Signup.jsx'
import { useAuth } from './context/AuthContext.js';

function App() {
  const { isAuthenticated, role, logout } = useAuth(); // Lấy trạng thái đăng nhập và role từ AuthContext

  const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role === 'ADMIN' || isAuthenticated && role === 'EMPLOYEE' ? (
          <Component {...props} />
        ) : isAuthenticated ? (
          <Redirect to="/" /> // Nếu đã đăng nhập nhưng không phải admin
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  const LoginRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : role === 'ADMIN' || role === 'EMPLOYEE' ? (
          <Redirect to="/admin" />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );

  const ClientRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role === 'ADMIN' || isAuthenticated && role === 'EMPLOYEE' ? (
          <Redirect to="/admin" /> // Chuyển hướng admin về trang admin
        ) : (
          <Component {...props} /> // Cho phép tất cả các trường hợp khác
        )
      }
    />
  );

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <LoginRoute path="/login" component={Login} />
          <LoginRoute path="/signup" component={Signup} />
          <AdminRoute path="/admin" component={Admin} />
          <ClientRoute path="/" component={Client} />

          {/* Các route không cần xác thực */}
          <Route path="/doi-mat-khau" component={DoiMatKhau} />
          <Route path="/quen-mat-khau" component={QuenMatKhau} />

          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;