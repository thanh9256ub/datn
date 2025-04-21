import React from 'react';
import '../admin/App.scss'
import { Switch, Route } from 'react-router-dom';
import Footer from './Footer/Footer';
import Navbar from '../admin/shared/Navbar.js';
// import Navbar from './Navbar/Navbar.jsx';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import all_banner from './Assets/shoes_banner4.png'
import ShopAllProduct from './Pages/ShopAllProduct.jsx';
import Product from './Pages/Product';
import { SearchOrder } from './Pages/SearchOrder.jsx';
import ChatBot from './chatbot/ChatBot.jsx';
import CustomerProfile from './CustomerProfile/CustomerProfile.jsx';
import Policy from './Pages/Policy.jsx';
import Description from './Pages/Description.jsx';

const Client = () => {

    return (
        <div>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Shop} />
                <Route path="/all" component={() => <ShopAllProduct banner={all_banner} />} />
                <Route path="/cart" component={Cart} />
                <Route exact path="/product/:productID" component={Product} />
                <Route path="/cart" component={Cart} />
                <Route path="/lookup" component={SearchOrder} />
                <Route path="/policy" component={Policy} />
                <Route path="/description" component={Description} />
                <Route path="/profile" component={CustomerProfile} />
            </Switch>
            <ChatBot />
            <Footer />
        </div>
    )
}

export default Client