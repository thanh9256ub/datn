import React, { use, useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import nav_dropdown from '../Assets/drop_down_icon.png'
const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    const handleLink = () => {
        window.location.href = '/';
    }
    return (
        <div className='navbar-client'>
            <div className="nav-left">
                <div className='nav-logo'>
                    <img onClick={handleLink} src={logo} alt="" />
                    <p>SHOPPER</p>
                </div>
                <div style={{ position: "relative" }}>
                    <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
                    <ul ref={menuRef} className="nav-menu">
                        <li onClick={() => { setMenu("shop") }}><Link to='/'>Shop</Link></li>
                        <li onClick={() => { setMenu("all") }}><Link to='/all'>All</Link></li>
                        <li onClick={() => { setMenu("mens") }}><Link to='/mens'>Top Sellers</Link></li>
                        <li onClick={() => { setMenu("womens") }}><Link to='/womens'>New Product</Link></li>
                        <li onClick={() => { setMenu("kids") }}><Link to='/kids'>Others</Link></li>

                    </ul>
                </div>
            </div>
            <div className="nav-login-cart">
                <Link to='/login'><button>Login</button></Link>
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}
export default Navbar