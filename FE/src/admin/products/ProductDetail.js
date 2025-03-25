import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getProductDetailByProductId } from './service/ProductDetailService';
import { getImagesByProductColor, getProductById, getProductColorsByProductId } from './service/ProductService';
import { getColors } from './service/ColorService';
import { getSizes } from './service/SizeService';
import ProductInfo from './components/ProductInfo';
import ProductVariantList from './components/ProductVariantList';
import ProductVariantDetail from './components/ProductVariantDetail';
import { ToastContainer } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [productDetails, setProductDetails] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorImages, setColorImages] = useState([]);
    const [productColorList, setProductColorList] = useState([]);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const productResponse = await getProductById(id);
            setProduct(productResponse.data.data);
            console.log(productResponse.data.data);

            const response = await getProductDetailByProductId(id);
            const pd = response.data.data
            setProductDetails(pd);
            console.log(pd)

            const colorResponse = await getColors();
            setColors(colorResponse.data.data);

            const sizeResponse = await getSizes();
            setSizes(sizeResponse.data.data);

            const productColorResponse = await getProductColorsByProductId(id);
            setProductColorList(productColorResponse.data.data);
            console.log("Product Color List:", productColorResponse.data.data);

            if (!selectedVariant || !pd.some(variant => variant.id === selectedVariant.id)) {
                setSelectedVariant(pd[0]);  // Chỉ chọn nếu biến thể đang chọn không tồn tại
            }

        } catch (error) {
            console.log("Lỗi lấy dữ liệu product details: ", error);
        }
    }

    const handleVariantClick = async (selectedVariant) => {
        setSelectedVariant(selectedVariant);

        const selectedColorId = selectedVariant?.color?.id || null;
        const selectedProductId = selectedVariant?.product?.id || null;

        console.log("selectedColorId: ", selectedColorId)

        if (selectedColorId && selectedProductId) {
            const productColor = productColorList.find(pc =>
                pc.product.id === selectedProductId && pc.color.id === selectedColorId
            );

            console.log("ProductColor by color: ", productColor)

            if (productColor) {
                try {
                    const imagesResponse = await getImagesByProductColor(productColor.id);
                    console.log("Images API Response:", imagesResponse.data.data);

                    setColorImages(imagesResponse.data.data);

                } catch (error) {
                    console.log("Lỗi khi lấy ảnh màu sắc:", error);
                    setColorImages([]);
                }
            } else {
                setColorImages([]);
            }
        } else {
            setColorImages([]);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className='row'>
                        <div className="col-lg-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <ProductInfo product={product} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <ProductVariantList
                                        productDetails={productDetails}
                                        selectedVariant={selectedVariant}
                                        setSelectedVariant={setSelectedVariant}
                                        setColorImages={setColorImages}
                                        productColorList={productColorList}
                                        id={id}
                                        handleVariantClick={handleVariantClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <ProductVariantDetail
                                selectedVariant={selectedVariant}
                                colors={colors}
                                sizes={sizes}
                                setSelectedVariant={setSelectedVariant}
                                colorImages={colorImages}
                                refreshProductDetail={fetchProductDetails}
                                handleVariantClick={handleVariantClick}
                                productDetails={productDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default ProductDetail