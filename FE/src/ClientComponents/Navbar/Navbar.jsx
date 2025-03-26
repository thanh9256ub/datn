import React, { use, useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/H2TL(1).png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import nav_dropdown from '../Assets/icons8-menu-50.png'

import { Dropdown, DropdownButton } from 'react-bootstrap'
const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    const handleLogout = () => {
        // Remove token from localStorage and reload the page to reflect the changes
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    return (
        <div className='navbar-client'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
            </div>
            <div style={{ position: "relative" }}>
                <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
                <ul ref={menuRef} className="nav-menu">
                    <li onClick={() => { setMenu("shop") }}><Link to="/" className={menu === "shop" ? "active" : ""}>Shop</Link></li>
                    <li onClick={() => { setMenu("all") }}><Link to='/all' className={menu === "all" ? "active" : ""}>All</Link></li>
                    <li onClick={() => { setMenu("mens") }}><Link to='/mens' className={menu === "mens" ? "active" : ""}>Top Sellers</Link></li>
                    <li onClick={() => { setMenu("womens") }}><Link to='/womens' className={menu === "womens" ? "active" : ""}>New Product</Link></li>
                    <li onClick={() => { setMenu("kids") }}><Link to='/kids' className={menu === "kids" ? "active" : ""}>Others</Link></li>

                </ul>
            </div>
            {
                localStorage.getItem('token')
                    ? (
                        <>

                            

                            <Link to='/logout'>
                                <button className='button-login' onClick={handleLogout}>Logout</button>
                            </Link>

                        </>
                    )
                    : (
                        <>
                            <Link to='/login'>
                                <button className='button-login'>Login</button>
                            </Link>
                            <Link to='/signup'>
                                <button className='button-login'>Đăng kí</button>
                            </Link>
                        </>
                    )
            }
            <Link to='/cart'><img src={cart_icon} alt="" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    )
}
export default Navbar