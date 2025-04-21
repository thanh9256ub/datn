import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';

class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/admin/apps', state: 'appsMenuOpen' },
      { path: '/admin/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/admin/advanced-ui', state: 'advancedUiMenuOpen' },
      { path: '/admin/form-elements', state: 'formElementsMenuOpen' },
      { path: '/admin/tables', state: 'tablesMenuOpen' },
      { path: '/admin/maps', state: 'mapsMenuOpen' },
      { path: '/admin/icons', state: 'iconsMenuOpen' },
      { path: '/admin/charts', state: 'chartsMenuOpen' },
      { path: '/admin/user-pages', state: 'userPagesMenuOpen' },
      { path: '/admin/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/admin/ecommerce', state: 'ecommercePagesMenuOpen' },
      { path: '/admin/counter', state: 'counterPagesMenuOpen' },
      { path: '/admin/products', state: 'productsPagesMenuOpen' },
      { path: '/admin/brands', state: 'brandsPagesMenuOpen' },
      { path: '/admin/materials', state: 'materialsPagesMenuOpen' },
      { path: '/admin/employees', state: 'employeesPagesMenuOpen' },
      { path: '/admin/customers', state: 'customersPagesMenuOpen' },
      { path: '/admin/orders', state: 'ordersPagesMenuOpen' },
      { path: '/admin/vouchers', state: 'vouchersPagesMenuOpen' },
      { path: '/admin/statistics', state: 'statisticsPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
              <div className="nav-profile-image">
                <img src={localStorage.getItem("image")} alt="profile" />
                <span className="login-status online"></span> {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2"><Trans>{localStorage.getItem('fullName')}</Trans></span>
                <span className="text-secondary text-small"><Trans>{localStorage.getItem('role')}</Trans></span>
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          <li className={this.isPathActive('/admin/dashboard') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/dashboard">
              <span className="menu-title"><Trans>Dashboard</Trans></span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/counter') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/counter">
              <span className="menu-title"><Trans>Quầy</Trans></span>
              <i className="mdi mdi-cart menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/products') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.productsPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('productsPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Sản phẩm</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-archive menu-icon"></i>
            </div>
            <Collapse in={this.state.productsPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/products') ? 'nav-link active' : 'nav-link'} to="/admin/products"><Trans>Sản phẩm</Trans></Link></li>
                {localStorage.getItem("role") === "ADMIN" && (
                  <li className="nav-item"> <Link className={this.isPathActive('/admin/brands') ? 'nav-link active' : 'nav-link'} to="/admin/brands"><Trans>Thương hiệu</Trans></Link></li>
                )}
                {localStorage.getItem("role") === "ADMIN" && (
                  <li className="nav-item"> <Link className={this.isPathActive('/admin/categories') ? 'nav-link active' : 'nav-link'} to="/admin/categories"><Trans>Danh mục</Trans></Link></li>
                )}
                {localStorage.getItem("role") === "ADMIN" && (
                  <li className="nav-item"> <Link className={this.isPathActive('/admin/materials') ? 'nav-link active' : 'nav-link'} to="/admin/materials"><Trans>Chất liệu</Trans></Link></li>
                )}
                {localStorage.getItem("role") === "ADMIN" && (
                  <li className="nav-item"> <Link className={this.isPathActive('/admin/colors') ? 'nav-link active' : 'nav-link'} to="/admin/colors"><Trans>Màu sắc</Trans></Link></li>
                )}
                {localStorage.getItem("role") === "ADMIN" && (
                  <li className="nav-item"> <Link className={this.isPathActive('/admin/sizes') ? 'nav-link active' : 'nav-link'} to="/admin/sizes"><Trans>Kích cỡ</Trans></Link></li>
                )}
              </ul>
            </Collapse>
          </li>
          {localStorage.getItem("role") === "ADMIN" &&
            <li className={this.isPathActive('/admin/employees') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/admin/employees">
                <span className="menu-title"><Trans>Nhân viên</Trans></span>
                <i className="mdi mdi-account-card-details menu-icon"></i>
              </Link>
            </li>
          }
          <li className={this.isPathActive('/admin/customers') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/customers">
              <span className="menu-title"><Trans>Khách hàng</Trans></span>
              <i className="mdi mdi-account-circle menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/orders') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/orders">
              <span className="menu-title"><Trans>Đơn hàng</Trans></span>
              <i className="mdi mdi-clipboard menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/vouchers') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/vouchers">
              <span className="menu-title"><Trans>Khuyến mại</Trans></span>
              <i className="mdi mdi-sale menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/statistics') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/statistics">
              <span className="menu-title"><Trans>Thống kê</Trans></span>
              <i className="mdi mdi-chart-line menu-icon"></i>
            </Link>
          </li>
          {/* <hr />
          <li className={this.isPathActive('/admin/basic-ui') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('basicUiMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-crosshairs-gps menu-icon"></i>
            </div>
            <Collapse in={this.state.basicUiMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/basic-ui/buttons') ? 'nav-link active' : 'nav-link'} to="/admin/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link'} to="/admin/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/basic-ui/typography') ? 'nav-link active' : 'nav-link'} to="/admin/basic-ui/typography"><Trans>Typography</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/form-elements') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Form Elements</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            </div>
            <Collapse in={this.state.formElementsMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/form-elements/basic-elements') ? 'nav-link active' : 'nav-link'} to="/admin/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/tables') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('tablesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-table-large menu-icon"></i>
            </div>
            <Collapse in={this.state.tablesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/tables/basic-table') ? 'nav-link active' : 'nav-link'} to="/admin/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/icons') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('iconsMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-contacts menu-icon"></i>
            </div>
            <Collapse in={this.state.iconsMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/icons/mdi') ? 'nav-link active' : 'nav-link'} to="/admin/icons/mdi"><Trans>Material</Trans></Link></li>
              </ul>
            </Collapse>
          </li> */}
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);