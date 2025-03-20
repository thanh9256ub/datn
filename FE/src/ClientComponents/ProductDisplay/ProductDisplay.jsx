import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from '../Context/ShopContext';
import { fetchImagesByProductColor } from '../Service/productService';

const ProductDisplay = (props) => {
    const { product, productColors } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedColor, setSelectedColor] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);

    // Mặc định chọn màu đầu tiên khi component được render
    useEffect(() => {
        if (productColors.length > 0 && !selectedColor) {
            const defaultColor = productColors[0]; // Chọn màu đầu tiên
            setSelectedColor(defaultColor);
        }
    }, [productColors, selectedColor]);

    // Fetch hình ảnh khi selectedColor thay đổi
    useEffect(() => {
        const fetchImages = async () => {
            if (selectedColor) {
                setLoadingImages(true);
                setImages([]); // Xóa ảnh cũ trước khi tải mới
                try {
                    console.log("Fetching images for color ID:", selectedColor.id);
                    const imageResponse = await fetchImagesByProductColor(selectedColor.id);
                    console.log("Images fetched:", imageResponse);
                    // Đảm bảo imageResponse là mảng và có trường image
                    if (Array.isArray(imageResponse) && imageResponse.every(img => img.image)) {
                        setImages([...imageResponse]); // Tạo bản sao mới để buộc re-render
                    } else {
                        console.error("Invalid image response format:", imageResponse);
                        setImages([]);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                    setImages([]);
                } finally {
                    setLoadingImages(false);
                }
            } else {
                setImages([]);
            }
        };

        fetchImages();
    }, [selectedColor]);

    if (!product) {
        return <div>Product not found</div>;
    }

    const colors = productColors.length > 0 ? [...new Set(productColors.map(color => color.color.colorName))] : [];
    const price = product.price !== undefined ? product.price : 0;

    const handleColorSelect = (colorName) => {
        const selected = productColors.find(color => color.color.colorName === colorName);
        console.log("Selected color:", selected);
        setSelectedColor(selected); // Cập nhật selectedColor
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {loadingImages ? (
                        <div>Loading images...</div>
                    ) : images.length > 0 ? (
                        images.slice(0, 4).map((image, index) => (
                            <img key={index} src={image.image} alt={`Color ${selectedColor?.color.colorName}`} />
                        ))
                    ) : (
                        <>
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                        </>
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
                        {colors.length > 0 ? (
                            colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleColorSelect(color)}
                                    className={selectedColor?.color.colorName === color ? 'selected' : ''}
                                >
                                    {color}
                                </button>
                            ))
                        ) : (
                            <>
                                <button>Grey</button>
                                <button>White</button>
                                <button>Black</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <button>S</button>
                        <button>M</button>
                        <button>L</button>
                    </div>
                </div>
                <button className='add-to-card' onClick={() => { addToCart(product.id) }}>
                    ADD TO CART
                </button>
                <p className='productdisplay-right-category'><span>Category:</span>{productColors[0]?.product.category.categoryName || "Unknown"}</p>
                <p className='productdisplay-right-category'><span>Brand:</span>{productColors[0]?.product.brand.brandName || "Unknown"}</p>
            </div>
        </div>
    );
};

export default ProductDisplay;