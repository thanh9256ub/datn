import React, { useState, useEffect, useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Badge, Avatar } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext'; // Sử dụng AuthContext thay vì localStorage
import { ShopContext } from '../../ClientComponents/Context/ShopContext';
import logo from '../../assets/images/logo_h2tl.png';
import logoMini from '../../assets/images/logo_mini_h2tl.png';
import avt from '../../assets/images/faces/avt.jpg';

const Navbar = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    isAuthenticated,
    role,
    fullName,
    email,
    logout
  } = useAuth(); // Sử dụng useAuth để lấy thông tin

  const { getTotalCartItems } = useContext(ShopContext);
  const [activeMenu, setActiveMenu] = useState('shop');

  // Xác định menu active dựa trên URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveMenu('shop');
    else if (path === '/all') setActiveMenu('all');
    else if (path === '/policy') setActiveMenu('policy');
    else if (path === '/lookup') setActiveMenu('lookup');
  }, [location]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Sử dụng hàm logout từ AuthContext
    history.push('/login');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    window.location.href = '/doi-mat-khau';
  };

  const handleShowProfileCustomer = (e) => {
    e.preventDefault();
    history.push('/profile')
  }

  const displayName = fullName || email || 'Khách hàng';
  const isAdmin = role === 'ADMIN';
  const isEmployee = role === 'EMPLOYEE';
  const isCustomer = role === 'CUSTOMER';

  const menuItems = [
    { key: 'shop', label: <Trans>Trang chủ</Trans>, path: '/' },
    { key: 'all', label: <Trans>Sản phẩm</Trans>, path: '/all' },
    { key: 'policy', label: <Trans>Chính sách</Trans>, path: '/policy' },
    { key: 'lookup', label: <Trans>Tra cứu</Trans>, path: '/lookup' },
  ];

  const renderUserRole = () => {
    // if (isAdmin) return <Trans>Quản trị viên</Trans>;
    // if (isEmployee) return <Trans>Nhân viên</Trans>;
    return <Trans>Khách hàng</Trans>;
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to={isAdmin || isEmployee ? "/admin/dashboard" : "/"}>
          <img src={logo} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to={isAdmin || isEmployee ? "/admin/dashboard" : "/"}>
          <img src={logoMini} alt="logo" />
        </Link>
      </div>

      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        {/* Menu chính */}
        {!(isAdmin || isEmployee) && (
          <div className="navbar-menu d-flex flex-grow-1 justify-content-left">
            <ul className="nav-menu d-flex align-items-center justify-content-center gap-4">
              {menuItems.map(item => (
                <li key={item.key} className={`nav-item ${activeMenu === item.key ? 'active' : ''}`}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveMenu(item.key)}
                    className="nav-link"
                  >
                    <span className="menu-title">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Thanh tìm kiếm (chỉ admin/employee) */}
        {(isAdmin || isEmployee) && (
          <>
            <button
              className="navbar-toggler navbar-toggler align-self-center"
              type="button"
              onClick={() => document.body.classList.toggle('sidebar-icon-only')}
            >
              <span className="mdi mdi-menu"></span>
            </button>

            <div className="search-field d-none d-md-block">
              <form className="d-flex align-items-center h-100">
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0"
                    placeholder="Search projects"
                  />
                </div>
              </form>
            </div>
          </>
        )}

        {/* Phần bên phải navbar */}
        <ul className="navbar-nav navbar-nav-right">
          {isAuthenticated ? (
            <li className="nav-item nav-profile">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link">
                  <div className="nav-profile-img">
                    <img src={localStorage.getItem('image')} alt="user" />
                    <span className="availability-status online"></span>
                  </div>
                  <div className="nav-profile-text">
                    <p className="mb-1 text-black">{displayName}</p>
                    {isCustomer &&
                      <small className="text-muted">{renderUserRole()}</small>
                    }
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="navbar-dropdown">
                  <Dropdown.Item onClick={handleShowProfileCustomer}>
                    <i className="mdi mdi-account mr-2 text-success"></i>
                    <Trans>Thông tin</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleChangePassword}>
                    <i className="mdi mdi-cached mr-2 text-success"></i>
                    <Trans>Đổi mật khẩu</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="mdi mdi-logout mr-2 text-primary"></i>
                    <Trans>Đăng xuất</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <i className="mdi mdi-login mr-2 text-primary"></i>
                <Trans>Đăng nhập</Trans>
              </Link>
            </li>
          )}

          {/* Giỏ hàng (chỉ hiển thị cho khách hàng) */}
          {!isAdmin && !isEmployee && (
            <li className="nav-item nav-logout d-none d-lg-block">
              <Link to="/cart">
                <Badge
                  count={getTotalCartItems()}
                  showZero
                  offset={[3, 3]}
                  style={{
                    backgroundColor: '#ff6b81',
                    boxShadow: 'none',
                    fontSize: '10px',
                    lineHeight: '16px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px'
                  }}
                >
                  <ShoppingCartOutlined
                    style={{
                      marginTop: '8px',
                      fontSize: '24px',
                      color: '#9d4edd',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  />
                </Badge>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;