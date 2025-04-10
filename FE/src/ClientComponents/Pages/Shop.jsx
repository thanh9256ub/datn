import React, { useEffect, useState } from 'react';
import {
    Row, Col, Typography, Button, Card, Space, Tag, 
} from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import slide1 from '../../assets/images/slide-show/slide1.jpg';
import slide2 from '../../assets/images/slide-show/slide2.jpg';
import slide3 from '../../assets/images/slide-show/slide3.jpg';
import { fetchProductColorsByProduct, fetchProductDetail } from '../Service/productService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const { Title, Text } = Typography;

const Shop = () => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productColors, setProductColors] = useState({});

    // Modern color palette
    const primaryColor = '#6C5CE7';
    const lightBg = '#F8F9FA';
    const darkText = '#2D3436';
    const successColor = '#00B894';

    const heroImages = [slide1, slide2, slide3];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await fetchProductDetail();
                const products = response.data || [];

                const uniqueProductsMap = new Map();
                products.forEach(item => {
                    if (!uniqueProductsMap.has(item.product.id)) {
                        uniqueProductsMap.set(item.product.id, item);
                    }
                });

                const colorPromises = products.map(async (item) => {
                    const colors = await fetchProductColorsByProduct(item.product.id);
                    return { productId: item.product.id, colors };
                });

                const colorData = await Promise.all(colorPromises);
                const colorMap = colorData.reduce((acc, { productId, colors }) => {
                    acc[productId] = colors;
                    return acc;
                }, {});

                setProducts(Array.from(uniqueProductsMap.values()));
                setProductColors(colorMap);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const limitedProducts = products.slice(0, 8);

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Hero Slider Section */}
            <section style={{ marginTop: 95 }}>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    {heroImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div style={{
                                position: 'relative',
                                paddingTop: '40%',
                                width: '100%'
                            }}>
                                <img
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            <section style={{
                maxWidth: 1400,
                margin: '64px auto',
                padding: '0 24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Title level={2} style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: darkText,
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                        SẢN PHẨM NỔI BẬT
                        <div style={{
                            position: 'absolute',
                            bottom: -8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 80,
                            height: 4,
                            backgroundColor: primaryColor,
                            borderRadius: 2
                        }} />
                    </Title>
                </div>

                <Row gutter={[32, 48]} justify="center">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card loading style={{ borderRadius: 12 }} />
                            </Col>
                        ))
                    ) : (
                        limitedProducts.map((product, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Card
                                    hoverable
                                    onClick={() => history.push(`/product/${product.product.id}`)}
                                    style={{
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        border: 'none'
                                    }}
                                    cover={
                                        <div style={{
                                            position: 'relative',
                                            paddingTop: '100%',
                                            backgroundColor: lightBg
                                        }}>
                                            <img
                                                alt={product.product.productName}
                                                src={product.product.mainImage}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    padding: 24
                                                }}
                                            />
                                        </div>
                                    }
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <div style={{ marginBottom: 8 }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {product.product.brand?.brandName || 'Thương hiệu'}
                                        </Text>
                                    </div>
                                    <Title level={5} style={{
                                        marginBottom: 8,
                                        color: darkText,
                                        fontWeight: 600,
                                        height: 44,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {product.product.productName}
                                    </Title>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        marginBottom: 16
                                    }}>
                                        <Text strong style={{
                                            fontSize: 18,
                                            color: primaryColor,
                                            marginRight: 8
                                        }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </Text>
                                        {product.originalPrice && (
                                            <Text delete type="secondary" style={{ fontSize: 14 }}>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.originalPrice)}
                                            </Text>
                                        )}
                                    </div>

                                    {productColors[product.product.id] && productColors[product.product.id].length > 0 && (
                                        <div style={{ display: 'flex', marginTop: 8 }}>
                                            {productColors[product.product.id].map((color, index) => (
                                                <Tag
                                                    key={index}
                                                    style={{
                                                        backgroundColor: color.color.colorCode,
                                                        color: '#fff',
                                                        marginRight: 8,
                                                        borderRadius: '50%',
                                                        width: 20,
                                                        height: 20,
                                                        textAlign: 'center',
                                                        lineHeight: '20px',
                                                        border: '0px'
                                                    }}
                                                >
                                                </Tag>
                                            ))}
                                        </div>
                                    )}

                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </section>

            <section style={{
                backgroundColor: lightBg,
                padding: '64px 0',
                marginBottom: 64
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '0 24px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={2} style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: darkText,
                            position: 'relative',
                            display: 'inline-block'
                        }}>
                            BỘ SƯU TẬP MỚI
                            <div style={{
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 80,
                                height: 4,
                                backgroundColor: primaryColor,
                                borderRadius: 2
                            }} />
                        </Title>
                        <Text style={{
                            display: 'block',
                            maxWidth: 600,
                            margin: '16px auto 0',
                            color: '#666'
                        }}>
                            Khám phá những thiết kế mới nhất từ bộ sưu tập của chúng tôi
                        </Text>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={4}
                        navigation
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            992: { slidesPerView: 4 }
                        }}
                        style={{ padding: '0 16px' }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <Card
                                    hoverable
                                    onClick={() => history.push(`/product/${product.product.id}`)}
                                    style={{
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        border: 'none',
                                        backgroundColor: '#fff'
                                    }}
                                    cover={
                                        <div style={{
                                            position: 'relative',
                                            paddingTop: '100%',
                                            backgroundColor: '#fff'
                                        }}>
                                            <img
                                                alt={product.product.productName}
                                                src={product.product.mainImage}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    }
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Title level={5} style={{
                                        marginBottom: 8,
                                        color: darkText,
                                        fontWeight: 600,
                                        textAlign: 'center'
                                    }}>
                                        {product.product.productName}
                                    </Title>
                                    <Text strong style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        color: primaryColor,
                                        fontSize: 16
                                    }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(product.price)}
                                    </Text>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Call to Action Section */}
            <section style={{
                maxWidth: 1400,
                margin: '0 auto 64px',
                padding: '0 24px',
                textAlign: 'center'
            }}>
                <Card style={{
                    borderRadius: 12,
                    backgroundColor: `${primaryColor}10`,
                    border: `1px solid ${primaryColor}20`,
                    padding: '48px 24px'
                }}>
                    <Title level={3} style={{
                        color: primaryColor,
                        marginBottom: 16
                    }}>
                        Đăng ký nhận bản tin
                    </Title>
                    <Text style={{
                        display: 'block',
                        marginBottom: 24,
                        fontSize: 16,
                        color: '#666'
                    }}>
                        Nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
                    </Text>
                    <Space.Compact style={{
                        maxWidth: 500,
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: `1px solid ${primaryColor}50`,
                                borderRadius: '8px 0 0 8px',
                                outline: 'none',
                                fontSize: 16
                            }}
                        />
                        <Button
                            type="primary"
                            style={{
                                height: 'auto',
                                borderRadius: '0 8px 8px 0',
                                backgroundColor: primaryColor,
                                borderColor: primaryColor,
                                padding: '0 24px'
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Space.Compact>
                </Card>
            </section>
        </div>
    );
};

export default Shop;