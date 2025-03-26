// import React, { useContext } from 'react'
// import './Css/ShopCategory.css'
// import { ShopContext } from '../Context/ShopContext'
// import dropdown_icon from '../Assets/dropdown_icon.png'
// import Item from '../Item/Item.'




// const ShopAllProduct = (props) => {
//     const { all_product } = useContext(ShopContext)
//     return (
//         <div className='shop-category'>
//             <img className='shopcategory-banner' src={props.banner} alt="" />
//             <div className="shopcategory-indexSort">
//                 <p>
//                     <span> Showing 1-12 </span> out of 36 products
//                 </p>
//                 <div className="shopcategory-sort">
//                     Sort by <img src={dropdown_icon} alt="" />
//                 </div>
//             </div>
//             <div className="shopcategory-products">
//                 {
//                     all_product.map((item, i) => {

//                         return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />

//                     })
//                 }
//             </div>
//             <div className="shopcategory-loadmore">
//                 Explore More
//             </div>
//         </div>
//     )
// }
// export default ShopAllProduct
// import Item from '../Item/Item.';
// import { fetchProducts } from '../Service/productService';
import React, { useContext, useEffect, useState } from 'react';
import './Css/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Assets/dropdown_icon.png';
import Item from '../Item/Item.';
import { fetchProducts, fetchProductDetail } from '../Service/productService';

const ShopAllProduct = (props) => {
    const { all_product } = useContext(ShopContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getProductsAndDetails = async () => {
            try {
                const productsResponse = await fetchProducts();
                const productDetailsResponse = await fetchProductDetail();

                console.log('Products Response:', productsResponse);
                console.log('Product Details Response:', productDetailsResponse);

                if (isMounted) {
                    const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
                    const detailsData = Array.isArray(productDetailsResponse.data) ? productDetailsResponse.data : [];

                    const mergedProducts = productsData.map((product) => {
                        // Tìm chi tiết sản phẩm dựa trên product.id
                        const detail = detailsData.find((d) => d.product.id === product.id);
                        return {
                            ...product,
                            price: detail ? detail.price : 'N/A', // Lấy price từ productDetail
                        };
                    });

                    setProducts(mergedProducts);
                }
            } catch (error) {
                console.error('Error fetching products or details:', error);
                if (isMounted) {
                    setProducts([]);
                }
            }
        };

        getProductsAndDetails();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className='shop-category'>
            <img className='shopcategory-banner' src={props.banner} alt="" />
            <div className="shopcategory-indexSort">
                <p>
                    <span> Showing 1-12 </span> out of {products.length} products
                </p>
                <div className="shopcategory-sort">
                    Sort by <img src={dropdown_icon} alt="" />
                </div>
            </div>
            <div className="shopcategory-products">
                {Array.isArray(products) && products.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        product={item}
                        price={item.price}
                    />
                ))}
            </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>
    );
};

export default ShopAllProduct;