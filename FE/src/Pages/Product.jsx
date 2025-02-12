import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom'
import Breadcrum from '../ClientComponents/Breadcrums/Breadcrum'
import ProductDisplay from '../ClientComponents/ProductDisplay/ProductDisplay'
import DescriptionBox from '../ClientComponents/DescriptionBox/DescriptionBox'
import RelatedProducts from '../ClientComponents/RelatedProducts/RelatedProducts'

const Product = () => {
    const { all_product } = useContext(ShopContext);
    const { productID } = useParams();
    const product = all_product.find((e) => e.id === Number(productID));
    return (
        <div>
            <Breadcrum product={product} />
            <ProductDisplay product={product} />
            <DescriptionBox />
            <RelatedProducts />
        </div>
    )
}
export default Product