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

// import React from 'react';
// import './Item.css';
// import { Link } from 'react-router-dom';

// const Item = (props) => {
//     const { id, product, price } = props;

//     if (!product || !product.mainImage) {
//         return (
//             <div className='item'>
//                 <p>Không thể tải thông tin sản phẩm.</p>
//             </div>
//         );
//     }

//     return (
//         <div className='item'>
//             <Link to={`/product/${id}`}>
//                 <img
//                     onClick={() => window.scrollTo(0, 0)}
//                     src={product.mainImage}
//                     alt={product.productName || 'Sản phẩm'}
//                 />
//             </Link>
//             <p>{product.productName || 'Tên sản phẩm'}</p>
//             <div className="item-prices">
//                 <div className="item-price-new">
//                     ${price !== undefined && price !== null ? price.toLocaleString() : 'N/A'}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Item;
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
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const Item = (props) => {
    const { id, product, price } = props;

    if (!product || !product.mainImage) {
        return (
            <Card
                style={{
                    width: window.innerWidth > 1280 ? 280 : window.innerWidth > 1024 ? 220 : window.innerWidth > 800 ? 170 : window.innerWidth > 500 ? 120 : 160,
                    textAlign: 'center',
                }}
            >
                <Text>Không thể tải thông tin sản phẩm.</Text>
            </Card>
        );
    }

    return (
        <Card
            hoverable
            style={{
                width: window.innerWidth > 1280 ? 280 : window.innerWidth > 1024 ? 220 : window.innerWidth > 800 ? 170 : window.innerWidth > 500 ? 120 : 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out',
            }}
            bodyStyle={{ padding: '6px 0' }}
        >
            <Link to={`/product/${id}`}>
                <img
                    onClick={() => window.scrollTo(0, 0)}
                    src={product.mainImage}
                    alt={product.productName || 'Sản phẩm'}
                    style={{
                        width: window.innerWidth > 1280 ? 280 : window.innerWidth > 1024 ? 220 : window.innerWidth > 800 ? 170 : window.innerWidth > 500 ? 120 : 160,
                        height: 280, // Giữ chiều cao cố định như CSS gốc
                        objectFit: 'cover',
                    }}
                />
            </Link>
            <Text
                style={{
                    margin: '6px 0',
                    fontSize: window.innerWidth > 1280 ? 16 : window.innerWidth > 1024 ? 14 : window.innerWidth > 800 ? 13 : 12,
                    fontWeight: 500,
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {product.productName || 'Tên sản phẩm'}
            </Text>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 10,
                    width: '100%',
                }}
            >
                <Text
                    strong
                    style={{
                        color: '#374151',
                        fontSize: window.innerWidth > 1280 ? 18 : window.innerWidth > 1024 ? 14 : 13,
                        fontWeight: 600,
                    }}
                >
                    {price !== undefined && price !== null ? price.toLocaleString() : 'N/A'} VNĐ
                </Text>
            </div>
        </Card>
    );
};

export default Item;