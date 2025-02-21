import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from './Footer/Footer';
import men_banner from './Assets/banner_mens.png'
import women_banner from './Assets/banner_women.png'
import kid_banner from './Assets/banner_kids.png'
import Navbar from './Navbar/Navbar';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';

const Client = () => {
    return (
        <div>
            <Navbar />
            <Switch>
                <Route path='/' component={Shop} />
                <Route path='/mens' component={() => <ShopCategory banner={men_banner} category="men" />} />
                <Route path='/womens' component={() => <ShopCategory banner={women_banner} category="women" />} />
                <Route path='/kids' component={() => <ShopCategory banner={kid_banner} category="kid" />} />
                <Route path="/product" component={Product}>
                    <Route path=':productID' component={Product} />
                </Route>
                <Route path='/cart' component={Cart} />
                <Route path='/login' component={LoginSignup} />
            </Switch>
            <Footer />
        </div>
    )
}

export default Client