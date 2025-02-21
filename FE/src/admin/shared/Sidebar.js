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
      { path: '/admin/general-pages', state: 'generalPagesMenuOpen' },
      { path: '/admin/ecommerce', state: 'ecommercePagesMenuOpen' },
      { path: '/admin/counter', state: 'counterPagesMenuOpen' },
      { path: '/admin/products', state: 'productsPagesMenuOpen' },
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
                <img src={require("../../assets/images/faces/face1.jpg")} alt="profile" />
                <span className="login-status online"></span> {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2"><Trans>David Grey. H</Trans></span>
                <span className="text-secondary text-small"><Trans>Project Manager</Trans></span>
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
          </li>
          <li className={this.isPathActive('/admin/charts') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('chartsMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Charts</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </div>
            <Collapse in={this.state.chartsMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/charts/chart-js') ? 'nav-link active' : 'nav-link'} to="/admin/charts/chart-js"><Trans>Chart Js</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/user-pages') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('userPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-lock menu-icon"></i>
            </div>
            <Collapse in={this.state.userPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/user-pages/login-1') ? 'nav-link active' : 'nav-link'} to="/admin/user-pages/login-1"><Trans>Login</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/user-pages/register-1') ? 'nav-link active' : 'nav-link'} to="/admin/user-pages/register-1"><Trans>Register</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/user-pages/lockscreen') ? 'nav-link active' : 'nav-link'} to="/admin/user-pages/lockscreen"><Trans>Lockscreen</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/error-pages') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('errorPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Error Pages</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-security menu-icon"></i>
            </div>
            <Collapse in={this.state.errorPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/error-pages/error-404') ? 'nav-link active' : 'nav-link'} to="/admin/error-pages/error-404">404</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/error-pages/error-500') ? 'nav-link active' : 'nav-link'} to="/admin/error-pages/error-500">500</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/general-pages') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.generalPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('generalPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>General Pages</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-medical-bag menu-icon"></i>
            </div>
            <Collapse in={this.state.generalPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/general-pages/blank-page') ? 'nav-link active' : 'nav-link'} to="/admin/general-pages/blank-page"><Trans>Blank Page</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive('/admin/counter') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/admin/counter">
              <span className="menu-title"><Trans>Counter</Trans></span>
              <i className="mdi mdi-cart-outline menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/admin/product') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.productsPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('productsPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>Products</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-archive menu-icon"></i>
            </div>
            <Collapse in={this.state.productsPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/admin/products/brand') ? 'nav-link active' : 'nav-link'} to="/admin/products/brand"><Trans>Brand</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/products/category') ? 'nav-link active' : 'nav-link'} to="/admin/products/category"><Trans>Category</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/admin/products/material') ? 'nav-link active' : 'nav-link'} to="/admin/products/material"><Trans>Material</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
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