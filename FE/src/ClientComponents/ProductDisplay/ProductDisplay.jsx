import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../Context/ShopContext';
import { fetchSizesByColor, fetchImagesByProductColor } from '../Service/productService'; // Dùng API đã được tạo

const ProductDisplay = (props) => {
    const { product, productColors } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedColorId, setSelectedColorId] = useState(null); // Lưu colorId
    const [selectedProductColorId, setSelectedProductColorId] = useState(null); // Lưu productColorId
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [sizes, setSizes] = useState([]); // State để lưu trữ các size theo màu
    const [selectedSize, setSelectedSize] = useState(null); // State để lưu trữ size đã chọn

    // Mặc định chọn màu đầu tiên khi component được render
    useEffect(() => {
        if (productColors.length > 0 && !selectedColorId) {
            const defaultColor = productColors[0]; // Chọn màu đầu tiên
            setSelectedColorId(defaultColor.color.id); // Lưu colorId
            setSelectedProductColorId(defaultColor.id); // Lưu productColorId
        }
    }, [productColors, selectedColorId]);

    // Fetch hình ảnh khi selectedProductColorId thay đổi
    useEffect(() => {
        const fetchImages = async () => {
            if (selectedProductColorId) {
                setLoadingImages(true);
                setImages([]); // Xóa ảnh cũ trước khi tải mới
                try {
                    console.log("Fetching images for productColorId:", selectedProductColorId);
                    const imageResponse = await fetchImagesByProductColor(selectedProductColorId); // Sử dụng productColorId
                    console.log("Images fetched:", imageResponse);
                    if (Array.isArray(imageResponse) && imageResponse.every(img => img.image)) {
                        setImages([...imageResponse]); // Tạo bản sao mới để buộc re-render
                    } else {
                        console.error("Invalid image response format:", imageResponse);
                        setImages([]);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                    setImages([]); // Xử lý lỗi
                } finally {
                    setLoadingImages(false);
                }
            } else {
                setImages([]); // Nếu không có màu, xóa ảnh
            }
        };


        fetchImages();
    }, [selectedProductColorId]);

    // Fetch size khi selectedColorId thay đổi
    useEffect(() => {
        const fetchSizes = async () => {
            if (selectedColorId) {
                try {
                    console.log("Fetching sizes for color ID:", selectedColorId);
                    const sizeResponse = await fetchSizesByColor(product.id, selectedColorId); // Gọi API theo colorId
                    console.log("Sizes fetched:", sizeResponse);
                    setSizes(sizeResponse);
                    setSelectedSize(sizeResponse.length > 0 ? sizeResponse[0].id : null); // Mặc định chọn size đầu tiên
                } catch (error) {
                    console.error('Error fetching sizes:', error);
                    setSizes([]); // Nếu có lỗi, đặt sizes về mảng rỗng
                }
            }
        };

        fetchSizes();
    }, [selectedColorId, product.id]);

    if (!product) {
        return <div>Product not found</div>;
    }

    const colors = productColors.length > 0 ? [...new Set(productColors.map(color => color.color.colorName))] : [];
    const price = product.price !== undefined ? product.price : 0;

    const handleColorSelect = (colorId, productColorId) => {
        console.log("Selected color ID:", colorId);
        setSelectedColorId(colorId); // Lưu colorId (ID màu)
        setSelectedProductColorId(productColorId); // Lưu productColorId (ID màu sản phẩm)
    };


    const handleSizeSelect = (sizeId) => {
        console.log("Selected size ID:", sizeId);  // Log để kiểm tra
        setSelectedSize(sizeId); // Cập nhật selectedSize
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {loadingImages ? (
                        <div>Loading images...</div>
                    ) : images.length > 0 ? (
                        images.slice(0, 4).map((image, index) => (
                            <img key={index} src={image.image} alt={`Color ${selectedProductColorId}`} />
                        ))
                    ) : (
                        <img src={product.image} alt={product.name} />
                    )}
                </div>
                <div className="productdisplay-img">
                    <img
                        className='productdisplay-main-img'
                        src={images.length > 0 ? images[0].image : product.image}
                        alt={product.name}
                    />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price">${price.toLocaleString()}</div>
                </div>
                <div className="productdisplay-right-description">
                    Số lượng hàng: {productColors[0]?.product.totalQuantity || 0}
                </div>
                <div className="productdisplay-right-color">
                    <h1>Select Color</h1>
                    <div className="productdisplay-right-colors">
                        {productColors.length > 0 ? (
                            productColors.map((productColor, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleColorSelect(productColor.color.id, productColor.id)} // Lưu cả colorId và productColorId
                                    className={selectedColorId === productColor.color.id ? 'selected' : ''}
                                >
                                    {productColor.color.colorName} {/* Hiển thị tên màu */}
                                </button>
                            ))
                        ) : (
                            <button>Grey</button>
                        )}
                    </div>
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        {sizes.length > 0 ? (
                            sizes.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSizeSelect(size.id)}
                                    className={selectedSize === size.id ? 'selected' : ''}
                                >
                                    {size.sizeName}
                                </button>
                            ))
                        ) : (
                            <p>No sizes available</p>
                        )}
                    </div>
                </div>
                <button className='add-to-card' onClick={() => { addToCart(product.id, selectedProductColorId, selectedSize) }}>
                    ADD TO CART
                </button>
                <p className='productdisplay-right-category'><span>Category:</span>{productColors[0]?.product.category.categoryName || "Unknown"}</p>
                <p className='productdisplay-right-category'><span>Brand:</span>{productColors[0]?.product.brand.brandName || "Unknown"}</p>
            </div>
        </div>
    );
};

export default ProductDisplay;
