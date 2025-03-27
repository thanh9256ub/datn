import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Breadcrums/Breadcrum';
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import DescriptionBox from '../DescriptionBox/DescriptionBox';
import RelatedProducts from '../RelatedProducts/RelatedProducts';
import { fetchProductDetailByProduct, fetchProductColorsByProduct } from '../Service/productService';

const Product = () => {
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [productColors, setProductColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            if (!productID) {
                setError('Invalid product ID');
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching product with ID:", productID);
                const detailResponse = await fetchProductDetailByProduct(productID); // Lấy thông tin chính (price)
                const colorResponse = await fetchProductColorsByProduct(productID); // Lấy danh sách màu
                console.log("API response (product details):", detailResponse);
                console.log("API response (product colors):", colorResponse);

                const productData = detailResponse.length > 0 ? {
                    id: Number(productID),
                    name: detailResponse[0].product.productName || "Unnamed Product",
                    image: detailResponse[0].product.mainImage || "",
                    price: detailResponse[0].price || 0 // Lấy price từ product-detail
                } : null;

                if (isMounted) {
                    setProduct(productData);
                    setProductColors(colorResponse); // Danh sách màu từ product-color
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                if (isMounted) {
                    setError('Failed to load product');
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        return () => {
            isMounted = false;
        };
    }, [productID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <Breadcrum product={product} />
            <ProductDisplay product={product} productColors={productColors} />
            <DescriptionBox />
            <RelatedProducts />
        </div>
    );
};

export default Product;