import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';
import logo from '../../assets/images/logo_h2tl.png';
import logoMini from '../../assets/images/logo_mini_h2tl.png';
import userImage from '../../assets/images/faces/face1.jpg';
import { Menu, Button, Badge, Drawer, Avatar, Space, ConfigProvider } from 'antd';

const Navbar = () => {
  const history = useHistory();
  const location = useLocation(); // Để theo dõi sự thay đổi đường dẫn
  const [fullName, setFullName] = useState('');
  const token = localStorage.getItem("token");
  const tokenClient = localStorage.getItem("tokenClient");
  const [menu, setMenu] = useState('shop');

  useEffect(() => {
    setFullName(localStorage.getItem('fullName') || 'Khách hàng');
  }, []);

  useEffect(() => {
    // Cập nhật menu khi đường dẫn thay đổi
    if (location.pathname === '/') setMenu('shop');
    if (location.pathname === '/all') setMenu('all');
    if (location.pathname === '/policy') setMenu('policy');
    if (location.pathname === '/lookup') setMenu('lookup');
  }, [location]); // Theo dõi sự thay đổi của location

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    history.push('/login-nhan-vien');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    history.push('/doi-mat-khau');
  };

  const menuItems = [
    { key: 'shop', label: <Link to="/">Trang chủ</Link> },
    { key: 'all', label: <Link to="/all">Sản phẩm</Link> },
    { key: 'policy', label: <Link to="/policy">Chính sách</Link> },
    { key: 'lookup', label: <Link to="/lookup" >Tra cứu</Link> },
  ];

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/admin/dashboard">
          <img src={logo} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/admin/dashboard">
          <img src={logoMini} alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        {token && localStorage.getItem("role") === "ADMIN" ? (
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
        ) : (
          <div className="navbar-menu d-flex flex-grow-1 justify-content-left">
            <ul className="nav-menu d-flex align-items-center justify-content-center gap-4">
              <li className={`nav-item ${menu === 'shop' ? 'active' : ''}`}>
                <Link to="/" onClick={() => setMenu('shop')} className="nav-link">
                  <span className="menu-title"><Trans>Trang chủ</Trans></span>
                </Link>
              </li>
              <li className={`nav-item ${menu === 'all' ? 'active' : ''}`}>
                <Link to="/all" onClick={() => setMenu('all')} className="nav-link">
                  <span className="menu-title"><Trans>Sản phẩm</Trans></span>
                </Link>
              </li>
              <li className={`nav-item ${menu === 'policy' ? 'active' : ''}`}>
                <Link to="/policy" onClick={() => setMenu('policy')} className="nav-link">
                  <span className="menu-title"><Trans>Chính sách</Trans></span>
                </Link>
              </li>
              <li className={`nav-item ${menu === 'lookup' ? 'active' : ''}`}>
                <Link to="/lookup" onClick={() => setMenu('lookup')} className="nav-link">
                  <span className="menu-title"><Trans>Tra cứu</Trans></span>
                </Link>
              </li>
            </ul>
          </div>
        )}
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link">
                <div className="nav-profile-img">
                  <img src={userImage} alt="user" />
                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black"><Trans>{fullName}</Trans></p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown">
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
          <li className="nav-item nav-logout d-none d-lg-block">
            <a className="nav-link" href="!#" onClick={(e) => e.preventDefault()}>
              <i className="mdi mdi-power"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
