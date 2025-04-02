import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from './Footer/Footer';
import Navbar from './Navbar/Navbar';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import men_banner from './Assets/shoes_banner1.png'
import women_banner from './Assets/shoes_banner2.png'
import kid_banner from './Assets/shoes_banner3.png'
import all_banner from './Assets/shoes_banner4.png'
import ShopAllProduct from './Pages/ShopAllProduct.jsx';

const Client = () => {

    return (
        <div>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Shop} />
                <Route path="/mens" component={() => <ShopCategory banner={men_banner} category="men" />} />
                <Route path="/all" component={() => <ShopAllProduct banner={all_banner} />} />
                <Route path="/womens" component={() => <ShopCategory banner={women_banner} category="women" />} />
                <Route path="/kids" component={() => <ShopCategory banner={kid_banner} category="kid" />} />
                <Route exact path="/product/:productID" component={Product} />
                <Route path="/cart" component={Cart} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />

            </Switch>
            <Footer />
        </div>
    )
}

export default Client