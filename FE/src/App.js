import logo from './logo.svg';
import './App.css';
import Navbar from './ClientComponents/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import { Carousel } from 'bootstrap';
import Footer from './ClientComponents/Footer/Footer';
import men_banner from './ClientComponents/Assets/banner_mens.png'
import women_banner from './ClientComponents/Assets/banner_women.png'
import kid_banner from './ClientComponents/Assets/banner_kids.png'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
          <Route path="/product" element={<Product />}>
            <Route path=':productID' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
