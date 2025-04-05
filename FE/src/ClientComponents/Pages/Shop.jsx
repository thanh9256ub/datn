import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Card } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import './Css/Shop.css';
import slide1 from '../../assets/images/slide-show/slide1.jpg'
import slide2 from '../../assets/images/slide-show/slide2.jpg'
import slide3 from '../../assets/images/slide-show/slide3.jpg'
import { fetchProductDetail } from '../Service/productService';


const { Title, Text } = Typography;

const Shop = () => {
    // Giả định dữ liệu sản phẩm từ API
    const [products, setProducts] = useState([])

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const heroImages = [
        slide1,
        slide2,
        slide3
    ];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProductDetail();
                const products = response.data || [];

                const uniqueProductsMap = new Map();
                products.forEach(item => {
                    if (!uniqueProductsMap.has(item.product.id)) {
                        uniqueProductsMap.set(item.product.id, item);
                    }
                });

                setProducts(Array.from(uniqueProductsMap.values()));
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        loadProducts();
    }, [])

    return (
        <div className="shop-container" style={{ marginTop: '100px' }}>
            {/* Hero Slider */}
            <section className="hero-section">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                >
                    {heroImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="hero-image"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Featured Products */}
            <section className="featured-section">
                <Title level={2} className="section-title">Sản phẩm nổi bật</Title>
                <Row gutter={[24, 24]} justify="center">
                    {products.map((product, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.product.productName}
                                        src={product.product.mainImage}
                                        style={{ background: '#f9f9f9' }}
                                    />
                                }
                                className="product-card"
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="product-info">
                                    <Title level={5} className="product-name">{product.product.productName}</Title>
                                    <Text type="secondary" className="product-brand">{product.product.brand.brandName}</Text>
                                    <Text strong className="product-price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </Text>
                                    {/* <Button type="primary" block className="add-to-cart-btn" style={{ marginTop: 'auto' }}>
                                        Thêm vào giỏ hàng
                                    </Button> */}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* New Collections */}
            <section className="new-collections">
                <Title level={2} className="section-title">BỘ SƯU TẬP MỚI</Title>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        576: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        992: { slidesPerView: 4 }
                    }}
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={product.id}>
                            <div className="collection-item">
                                <img
                                    src={product.product.mainImage}
                                    alt={product.product.productName}
                                    onClick={() => openLightbox(index)}
                                />
                                <div className="collection-info">
                                    <h3>{product.product.productName}</h3>
                                    <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

        </div >
    );
};

export default Shop;