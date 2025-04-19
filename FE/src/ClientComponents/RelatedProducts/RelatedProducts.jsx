import React from 'react';
import { Typography, Divider, Row, Col, Card, Button, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/swiper-bundle.min.css';

const { Title, Text } = Typography;

const RelatedProducts = ({ relatedProducts = [], currentProductId }) => {
    const history = useHistory();
    console.log('Related products data:', relatedProducts);

    // Color palette
    const primaryColor = '#6C5CE7';
    const lightBg = '#F8F9FA';
    const darkText = '#2D3436';
    const successColor = '#00B894';

    // Lọc bỏ sản phẩm hiện tại
    const filteredProducts = relatedProducts.filter(
        product => product.id !== currentProductId
    );

    if (filteredProducts.length === 0) {
        return (
            <div style={{ maxWidth: 1400, margin: '64px auto', padding: '0 24px', textAlign: 'center' }}>
                <Title level={2} style={{ color: darkText }}>
                    SẢN PHẨM LIÊN QUAN
                </Title>
                <Text type="secondary">Hiện chưa có sản phẩm liên quan</Text>
            </div>
        );
    }

    // Chỉ lấy 4 sản phẩm đầu tiên
    const displayProducts = filteredProducts.slice(0, 4);

    return (
        <div style={{ maxWidth: 1400, margin: '64px auto', padding: '0 24px' }}>
            <Title level={2} style={{
                textAlign: 'center',
                marginBottom: 24,
                position: 'relative',
                color: darkText
            }}>
                SẢN PHẨM LIÊN QUAN
            </Title>

            <div style={{ position: 'relative' }}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={32}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.custom-prev',
                        nextEl: '.custom-next'
                    }}
                    breakpoints={{
                        576: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        992: { slidesPerView: 4 }
                    }}
                    style={{ padding: '0 40px' }}
                >
                    {displayProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <Card
                                hoverable
                                onClick={() => history.push(`/product/${product.product.id}`)}
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    border: 'none',
                                    marginBottom: 24
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
                                                padding: 0
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
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigation buttons */}
                {displayProducts.length > 1 && (
                    <>
                        <Button
                            className="custom-prev"
                            shape="circle"
                            icon={<LeftOutlined />}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                width: 40,
                                height: 40
                            }}
                        />
                        <Button
                            className="custom-next"
                            shape="circle"
                            icon={<RightOutlined />}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                width: 40,
                                height: 40
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;