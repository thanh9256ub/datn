import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from "../Assets/star_icon.png"
import star_dull_icon from "../Assets/star_dull_icon.png"
import { ShopContext } from '../Context/ShopContext'



const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    Số lượng hàng: 20
                </div>
                <div className="productdisplay-right-color">
                    <h1>Select Color</h1>
                    <div className="productdisplay-right-colors">
                        <button>Grey</button>
                        <button>White</button>
                        <button>Black</button>
                    </div>
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <button>37</button>
                        <button>38</button>
                        <button>39</button>
                        <button>40</button>
                        <button>41</button>
                    </div>
                </div>
                <button className='add-to-card' onClick={() => { addToCart(product.id) }}>
                    ADD TO CART
                </button>
                <p className='productdisplay-right-category'><span>Category:</span>Women , T-Shirt, Crop Top</p>
                <p className='productdisplay-right-category'><span>Tags:</span>Modern, Latest</p>

            </div>
        </div>
    )
}

export default ProductDisplay