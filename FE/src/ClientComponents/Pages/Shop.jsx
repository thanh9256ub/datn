import React, { useEffect, useState } from 'react';
import {
    Row, Col, Typography, Button, Card, Badge, Tag,
    notification,
} from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import slide1 from '../../assets/images/slide-show/slide1.jpg';
import slide2 from '../../assets/images/slide-show/slide2.jpg';
import slide3 from '../../assets/images/slide-show/slide3.jpg';
import { fetchProductColorsByProduct, fetchProductDetail } from '../Service/productService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getActive } from '../../admin/vouchers/service/VoucherService';
import { CopyOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Shop = () => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productColors, setProductColors] = useState({});
    const [featuredProducts, setFeaturedProducts] = useState([]); // Sản phẩm bán chạy/nổi bật
    const [newProducts, setNewProducts] = useState([]); // Sản phẩm mới
    const [vouchers, setVouchers] = useState([]);

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

                const uniqueProducts = Array.from(uniqueProductsMap.values());

                const newProds = [...uniqueProducts].sort((a, b) =>
                    new Date(b.product.createdAt) - new Date(a.product.createdAt)
                ).slice(0, 8);

                const colorPromises = products.map(async (item) => {
                    const colors = await fetchProductColorsByProduct(item.product.id);
                    return { productId: item.product.id, colors };
                });

                const colorData = await Promise.all(colorPromises);
                const colorMap = colorData.reduce((acc, { productId, colors }) => {
                    acc[productId] = colors;
                    return acc;
                }, {});

                setProducts(uniqueProducts);
                setProductColors(colorMap);
                setNewProducts(newProds)

                const voucherResponse = await getActive();
                setVouchers(voucherResponse.data.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const copyVoucherCode = (code) => {
        try {
            navigator.clipboard.writeText(code).then(() => {
                notification.success({
                    message: 'Đã sao chép mã',
                    description: `Mã ${code} đã được sao chép vào clipboard`,
                    placement: 'topRight',
                });
            }).catch(err => {
                console.error('Failed to copy:', err);
                notification.error({
                    message: 'Lỗi khi sao chép',
                    description: 'Không thể sao chép mã, vui lòng thử lại',
                    placement: 'topRight',
                });
            });
        } catch (err) {
            console.error('Error:', err);
            // Fallback cho trình duyệt không hỗ trợ clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                notification.success({
                    message: 'Đã sao chép mã',
                    description: `Mã ${code} đã được sao chép vào clipboard`,
                    placement: 'topRight',
                });
            } catch (err) {
                notification.error({
                    message: 'Lỗi khi sao chép',
                    description: 'Không thể sao chép mã, vui lòng sao chép thủ công',
                    placement: 'topRight',
                });
            }
            document.body.removeChild(textArea);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getColorCode = (colorName) => {
        const colorMap = {
            'đỏ': 'red',
            'xanh': 'blue',
            'vàng': 'yellow',
            'đen': 'black',
            'trắng': 'white',
            'hồng': 'pink',
            'xám': 'gray',
            'xanh lá': 'green',
            'tím': 'purple',
            'cam': 'orange',
            'nâu': 'brown',
            'be': 'beige'
        };
        return colorMap[colorName.toLowerCase()] || '#ccc';
    };

    const renderProductCard = (product) => (
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
                    backgroundColor: lightBg,
                    overflow: 'hidden'
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
            </div>

            {productColors[product.product.id] && productColors[product.product.id].length > 0 && (
                <div style={{ display: 'flex', marginTop: 8 }}>
                    {productColors[product.product.id].map((color, index) => (
                        <Tag
                            key={index}
                            style={{
                                backgroundColor: color.color.colorCode || getColorCode(color.color.colorName),
                                color: '#fff',
                                marginRight: 8,
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                textAlign: 'center',
                                lineHeight: '20px',
                                border: '1px solid #00000'
                            }}
                        >
                        </Tag>
                    ))}
                </div>
            )}
        </Card>
    );

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: "50px" }}>
            <section style={{ marginTop: 70 }}>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    style={{
                        maxWidth: 1550,
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
                                width: '100%',
                                zIndex: 1
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

            {/* Phần Voucher - Đã được cải tiến */}
            <section style={{
                maxWidth: 1400,
                margin: '60px auto',
                padding: '0 40px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Title level={2} style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: darkText,
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                        KHUYẾN MẠI & ƯU ĐÃI
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
                        Những ưu đãi dành riêng cho khách hàng.
                    </Text>
                </div>

                {/* Danh sách voucher - Phiên bản cải tiến */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 20,
                    justifyItems: 'center'
                }}>
                    {(vouchers.length > 0 ? vouchers.slice(0, 4) : Array(4).fill(null)).map((voucher, index) => (
                        <div key={voucher ? voucher.id : `empty-${index}`} style={{
                            width: '100%',
                            height: '100%', // Đảm bảo tất cả voucher cùng chiều cao
                            minHeight: 220, // Chiều cao tối thiểu
                            background: 'white',
                            borderRadius: 12,
                            padding: 20,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: `1px solid ${primaryColor}20`,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            ':hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `0 8px 20px ${primaryColor}20`
                            }
                        }}>
                            {voucher ? (
                                <>
                                    {/* Badge số lượng */}
                                    <div style={{
                                        alignSelf: 'flex-end',
                                        background: voucher.quantity > 5 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                        color: voucher.quantity > 5 ? '#4CAF50' : '#FF9800',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '4px 10px',
                                        borderRadius: 12,
                                        // marginBottom: 12,
                                        border: `1px solid ${voucher.quantity > 5 ? '#4CAF50' : '#FF9800'}20`
                                    }}>
                                        Còn {voucher.quantity} mã
                                    </div>

                                    {/* Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 16
                                    }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            background: `${primaryColor}10`,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12,
                                            flexShrink: 0
                                        }}>
                                            <GiftOutlined style={{
                                                fontSize: 16,
                                                color: primaryColor
                                            }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                margin: 0,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: darkText,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {voucher.voucherName}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Giá trị voucher */}
                                    <div style={{
                                        background: `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%)`,
                                        borderRadius: 10,
                                        padding: '12px 0',
                                        textAlign: 'center',
                                        marginBottom: 16,
                                        flexGrow: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text strong style={{
                                            fontSize: '1.4rem',
                                            color: primaryColor,
                                            lineHeight: 1.3
                                        }}>
                                            {voucher.discountType === 0 ?
                                                `-${new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(voucher.discountValue)}` :
                                                `-${voucher.discountValue}%`}
                                        </Text>
                                    </div>

                                    {/* Thông tin phụ */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 16,
                                        fontSize: '0.8rem',
                                        gap: 8
                                    }}>
                                        <div style={{
                                            textAlign: 'center',
                                            flex: 1,
                                            background: '#f9f9f9',
                                            padding: '6px',
                                            borderRadius: 6
                                        }}>
                                            <div style={{ color: '#666', marginBottom: 4 }}>Đơn tối thiểu</div>
                                            <div style={{ fontWeight: 600 }}>
                                                {voucher.minOrderValue > 0 ?
                                                    `${new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)}₫` :
                                                    '0₫'}
                                            </div>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            flex: 1,
                                            background: '#f9f9f9',
                                            padding: '6px',
                                            borderRadius: 6
                                        }}>
                                            <div style={{ color: '#666', marginBottom: 4 }}>HSD</div>
                                            <div style={{ fontWeight: 600 }}>
                                                {formatDate(voucher.endDate)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mã voucher */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: `${primaryColor}05`,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: `1px solid ${primaryColor}20`
                                    }}>
                                        <div style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontSize: '0.9rem',
                                            fontWeight: 600
                                        }}>
                                            {voucher.voucherCode}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyVoucherCode(voucher.voucherCode);
                                            }}
                                            style={{
                                                background: primaryColor,
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'background 0.2s',
                                                ':hover': {
                                                    background: '#5d4bcf'
                                                }
                                            }}
                                        >
                                            <CopyOutlined style={{ fontSize: 14, marginRight: 6 }} />
                                            Copy
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Placeholder khi không có voucher */
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: '#ccc'
                                }}>
                                    <GiftOutlined style={{ fontSize: 32, marginBottom: 12 }} />
                                    <Text type="secondary">Không có voucher</Text>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section style={{
                maxWidth: 1200,
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
                        SẢN PHẨM MỚI
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
                        Những sản phẩm mới nhất vừa được thêm vào cửa hàng
                    </Text>
                </div>

                <Row gutter={[32, 48]} justify="center">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card loading style={{ borderRadius: 12 }} />
                            </Col>
                        ))
                    ) : newProducts.length > 0 ? (
                        newProducts.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Text type="secondary">Hiện không có sản phẩm mới</Text>
                        </Col>
                    )}
                </Row>
            </section>

            {/* Sản phẩm nổi bật Section */}
            <section style={{
                maxWidth: 1200,
                margin: '64px auto 0px',
                padding: '0 24px',
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
                    <Text style={{
                        display: 'block',
                        maxWidth: 600,
                        margin: '16px auto 0',
                        color: '#666'
                    }}>
                        Các sản phẩm được ưa chuộng nhất hiện nay
                    </Text>
                </div>

                <Row gutter={[32, 48]} justify="center">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card loading style={{ borderRadius: 12 }} />
                            </Col>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Text type="secondary">Hiện không có sản phẩm nổi bật</Text>
                        </Col>
                    )}
                </Row>
            </section>
        </div>
    );
};

export default Shop;