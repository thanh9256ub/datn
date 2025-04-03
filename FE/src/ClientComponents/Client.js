import React from 'react';
import '../admin/App.scss'
import { Switch, Route } from 'react-router-dom';
import Footer from './Footer/Footer';
import Navbar from '../admin/shared/Navbar.js';
// import Navbar from './Navbar/Navbar.jsx';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import all_banner from './Assets/shoes_banner4.png'
import ShopAllProduct from './Pages/ShopAllProduct.jsx';

const Client = () => {

    return (
        <div>
            <Navbar />
            <div style={{ marginBottom: "70px" }}></div>
            <Switch>
                <Route exact path="/" component={Shop} />
                <Route path="/all" component={() => <ShopAllProduct banner={all_banner} />} />
                <Route path="/cart" component={Cart} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
            </Switch>
            <Footer />
        </div>
    )
}

export default Client