// import React from 'react'
// import './Item.css'
// import { Link } from 'react-router-dom'
// const Item = (props) => {
//     return (
//         <div className='item'>
//             <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0, 0)} src={props.image} alt="" /></Link>
//             <p>{props.name}</p>
//             <div className="item-prices">
//                 <div className="item-price-new">
//                     ${props.new_price}
//                 </div>
//                 <div className="item-price-old">
//                     ${props.old_price}
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Item
// import React from 'react';
// import './Item.css';
// // import { Link } from 'react-router-dom';

import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
    const { id, product, price } = props;

    if (!product || !product.mainImage) {
        return (
            <div className='item'>
                <p>Không thể tải thông tin sản phẩm.</p>
            </div>
        );
    }

    return (
        <div className='item'>
            <Link to={`/product/${id}`}>
                <img
                    onClick={() => window.scrollTo(0, 0)}
                    src={product.mainImage}
                    alt={product.productName || 'Sản phẩm'}
                />
            </Link>
            <p>{product.productName || 'Tên sản phẩm'}</p>
            <div className="item-prices">
                <div className="item-price-new">
                    ${price !== undefined && price !== null ? price.toLocaleString() : 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Item;