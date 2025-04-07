import React, { useContext, useState, useEffect } from 'react';
import {
    Button, Card, Col, Row, Typography, Space, Divider, message,
    Modal, Descriptions, Image, Tag, Badge, App, Rate, Skeleton
} from 'antd';
import {
    ShoppingCartOutlined, CheckOutlined, CloseOutlined, HeartOutlined, ShareAltOutlined
} from '@ant-design/icons';
import { ShopContext } from '../Context/ShopContext';
import { fetchSizesByColor, fetchImagesByProductColor, fetchProductDetailByAttributes } from '../Service/productService';

const { Text, Title } = Typography;

const ProductDisplay = ({ product, productColors }) => {
    const { addToCart } = useContext(ShopContext);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [selectedProductColorId, setSelectedProductColorId] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [currentDetail, setCurrentDetail] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const selectedColorName = productColors.find(c => c.color.id === selectedColorId)?.color.colorName;
    const selectedSizeName = sizes.find(s => s.id === selectedSize)?.sizeName;

    // Modern color palette
    const primaryColor = '#6C5CE7'; // Purple
    const accentColor = '#00CEFF'; // Blue
    const successColor = '#00B894'; // Green
    const warningColor = '#FDCB6E'; // Yellow
    const lightBg = '#F8F9FA'; // Light gray
    const darkText = '#2D3436'; // Dark gray

    const handleColorOrSizeChange = async () => {
        if (selectedColorId && selectedSize) {
            try {
                const detail = await fetchProductDetailByAttributes(product.id, selectedColorId, selectedSize);
                if (detail) {
                    setCurrentDetail(detail);
                } else {
                    setCurrentDetail(null);
                    message.warning('Không có sản phẩm với tổ hợp màu và kích thước này');
                }
            } catch (error) {
                setCurrentDetail(null);
                if (error.response?.status === 404) {
                    message.warning('Tổ hợp màu và kích thước này không tồn tại');
                } else {
                    message.error('Lỗi khi tải chi tiết sản phẩm: ' + error.message);
                }
            }
        } else {
            setCurrentDetail(null);
        }
    };

    useEffect(() => {
        handleColorOrSizeChange();
    }, [selectedColorId, selectedSize]);

    useEffect(() => {
        if (productColors?.length > 0 && !selectedColorId) {
            const defaultColor = productColors[0];
            setSelectedColorId(defaultColor.color.id);
            setSelectedProductColorId(defaultColor.id);
            setMainImage(defaultColor.image || product?.image || '');
        }
    }, [productColors]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            message.warning('Vui lòng chọn size trước khi thêm vào giỏ');
            return;
        }

        if (!selectedColorId) {
            message.warning('Vui lòng chọn màu trước khi thêm vào giỏ');
            return;
        }

        const selectedColor = productColors.find(pc => pc.color.id === selectedColorId);
        const selectedSizeObj = sizes.find(s => s.id === selectedSize);

        setSelectedProductDetails({
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            productImage: mainImage,
            color: selectedColor.color,
            size: selectedSizeObj,
            price: product.price,
            productColorId: selectedProductColorId,
            sizeId: selectedSize
        });

        setConfirmModalVisible(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (selectedProductColorId && product?.id) {
                setLoadingImages(true);
                try {
                    const [imageResponse, sizeResponse] = await Promise.all([
                        fetchImagesByProductColor(selectedProductColorId),
                        fetchSizesByColor(product.id, selectedColorId)
                    ]);

                    setImages(imageResponse || []);
                    if (imageResponse?.length > 0) {
                        setMainImage(imageResponse[0].image);
                    }

                    setSizes(sizeResponse || []);
                    if (sizeResponse?.length > 0) {
                        // Chỉ đặt selectedSize nếu hiện tại không hợp lệ
                        if (!selectedSize || !sizeResponse.some(s => s.id === selectedSize)) {
                            setSelectedSize(sizeResponse[0].id);
                        }
                    } else {
                        setSelectedSize(null); // Reset nếu không có size
                        message.warning('Không có kích thước nào khả dụng cho màu này');
                    }
                } catch (error) {
                    console.error('Error loading data:', error);
                    message.error('Lỗi tải dữ liệu sản phẩm');
                } finally {
                    setLoadingImages(false);
                }
            }
        };
        fetchData();
    }, [selectedProductColorId, selectedColorId, product?.id]);

    const handleConfirmAddToCart = async () => {
        try {
            if (!selectedColorId || !selectedSize || !product?.id) {
                message.warning('Vui lòng chọn đầy đủ thông tin sản phẩm');
                return;
            }

            await addToCart({
                productId: product.id,
                colorId: selectedColorId,
                sizeId: selectedSize,
                quantity: 1
            });

            message.success('Đã thêm vào giỏ hàng');
            setConfirmModalVisible(false);
        } catch (error) {
            console.error("Error adding to cart:", error);
            message.error(error.message || 'Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (!product) return <Card>Sản phẩm không tồn tại</Card>;

    const handleColorChange = async (colorId, productColorId, newImage) => {
        setSelectedColorId(colorId);
        setSelectedProductColorId(productColorId);
        setMainImage(newImage || product.image || '');

        // Reset size khi đổi màu
        setSizes([]);
        setSelectedSize(null);

        try {
            const sizeResponse = await fetchSizesByColor(product.id, colorId);
            setSizes(sizeResponse || []);

            if (sizeResponse.length > 0) {
                setSelectedSize(sizeResponse[0].id); // Chọn size đầu tiên của màu mới
            }
        } catch (error) {
            message.error('Lỗi tải danh sách size');
        }
    };

    if (!product) return <Skeleton active paragraph={{ rows: 10 }} />;

    return (
        <App>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto',
                padding: '40px 24px',
                backgroundColor: '#fff'
            }}>
                <Row gutter={[48, 48]} align="top">
                    {/* Product Images Section */}
                    <Col xs={24} lg={12}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16
                        }}>
                            {/* Main Image */}
                            <Card
                                bordered={false}
                                bodyStyle={{ padding: 0 }}
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    backgroundColor: lightBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {mainImage && mainImage !== "image.png" ? (
                                        <img
                                            src={mainImage}
                                            alt={product.name}
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
                                    ) : (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#999'
                                        }}>
                                            <Skeleton.Image active />
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Thumbnail Gallery */}
                            <div style={{ padding: '8px 0' }}>
                                <Row gutter={[12, 12]} justify="start">
                                    {(images.length > 0 ? images : [{ image: product.image }]).map((img, index) => (
                                        <Col key={index} xs={8} sm={6} md={4} lg={6}>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    border: `2px solid ${mainImage === img.image ? primaryColor : '#f0f0f0'}`,
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    aspectRatio: '1/1',
                                                    backgroundColor: lightBg,
                                                    transition: 'all 0.3s',
                                                    position: 'relative'
                                                }}
                                                onClick={() => img.image && setMainImage(img.image)}
                                            >
                                                <img
                                                    src={img.image || 'https://via.placeholder.com/150?text=Ảnh+phụ'}
                                                    alt={product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        padding: 4
                                                    }}
                                                />
                                                {mainImage === img.image && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 4,
                                                        backgroundColor: primaryColor
                                                    }} />
                                                )}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>
                    </Col>

                    {/* Product Info Section */}
                    <Col xs={24} lg={12}>
                        <div style={{ paddingLeft: 8 }}>
                            {/* Product Title and Rating */}
                            <div style={{ marginBottom: 16 }}>
                                <Title
                                    level={1}
                                    style={{
                                        marginBottom: 8,
                                        fontWeight: 700,
                                        color: darkText,
                                        fontSize: 28
                                    }}
                                >
                                    {product.name}
                                </Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Rate
                                        disabled
                                        defaultValue={4.5}
                                        allowHalf
                                        style={{ color: warningColor, fontSize: 16 }}
                                    />
                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                        (12 đánh giá)
                                    </Text>
                                    <Tag color={successColor} style={{
                                        borderRadius: 4,
                                        fontWeight: 500,
                                        marginLeft: 8
                                    }}>
                                        Bán chạy
                                    </Tag>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div style={{
                                marginBottom: 24,
                                padding: '16px 0',
                                borderTop: `1px solid ${lightBg}`,
                                borderBottom: `1px solid ${lightBg}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                                    <Text strong style={{
                                        fontSize: 28,
                                        color: primaryColor,
                                        fontWeight: 700
                                    }}>
                                        ${product.price?.toLocaleString() || 0}
                                    </Text>
                                    {product.originalPrice && (
                                        <Text delete type="secondary" style={{ fontSize: 18 }}>
                                            ${product.originalPrice.toLocaleString()}
                                        </Text>
                                    )}
                                </div>
                                {currentDetail ? (
                                    <div style={{ marginTop: 8 }}>
                                        <Badge
                                            status="success"
                                            text={
                                                <Text style={{ color: successColor }}>
                                                    Còn {currentDetail.quantity} sản phẩm ({selectedSizeName}, {selectedColorName})
                                                </Text>
                                            }
                                        />
                                    </div>
                                ) : (
                                    <Text type="secondary">Vui lòng chọn màu và size</Text>
                                )}
                            </div>

                            {/* Color Selection */}
                            <div style={{ marginBottom: 32 }}>
                                <Text strong style={{
                                    display: 'block',
                                    marginBottom: 16,
                                    fontSize: 16,
                                    color: darkText
                                }}>
                                    MÀU SẮC
                                </Text>
                                <Space wrap size={[8, 8]}>
                                    {productColors.map((pc, index) => (
                                        <Button
                                            key={index}
                                            shape="round"
                                            size="middle"
                                            onClick={() => handleColorChange(pc.color.id, pc.id, pc.image)}
                                            style={{
                                                minWidth: 100,
                                                height: 42,
                                                borderColor: selectedColorId === pc.color.id ? primaryColor : '#e0e0e0',
                                                backgroundColor: selectedColorId === pc.color.id ? `${primaryColor}10` : 'white',
                                                color: selectedColorId === pc.color.id ? primaryColor : darkText,
                                                fontWeight: selectedColorId === pc.color.id ? 600 : 'normal',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}
                                        >
                                            <div style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                backgroundColor: pc.color.colorCode || '#ccc',
                                                border: `1px solid ${pc.color.colorCode ? '#00000020' : '#e0e0e0'}`
                                            }} />
                                            {pc.color.colorName}
                                        </Button>
                                    ))}
                                </Space>
                            </div>

                            {/* Size Selection */}
                            <div style={{ marginBottom: 40 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 16
                                }}>
                                    <Text strong style={{
                                        fontSize: 16,
                                        color: darkText
                                    }}>
                                        KÍCH CỠ
                                    </Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        style={{
                                            color: primaryColor,
                                            padding: '0 4px'
                                        }}
                                    >
                                        Hướng dẫn chọn size
                                    </Button>
                                </div>
                                <Space wrap size={[8, 8]}>
                                    {sizes.length > 0 ? (
                                        sizes.map((size, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => setSelectedSize(size.id)}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    fontSize: 16,
                                                    borderColor: selectedSize === size.id ? primaryColor : '#e0e0e0',
                                                    backgroundColor: selectedSize === size.id ? `${primaryColor}10` : 'white',
                                                    color: selectedSize === size.id ? primaryColor : darkText,
                                                    fontWeight: selectedSize === size.id ? 600 : 'normal',
                                                    borderRadius: 8,
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {size.sizeName}
                                            </Button>
                                        ))
                                    ) : (
                                        <Text type="secondary">Vui lòng chọn màu trước</Text>
                                    )}
                                </Space>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: 16,
                                marginBottom: 32
                            }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    block
                                    style={{
                                        height: 56,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        backgroundColor: primaryColor,
                                        borderColor: primaryColor,
                                        borderRadius: 8
                                    }}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </Button>
                                <Button
                                    size="large"
                                    icon={<HeartOutlined />}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderColor: isWishlisted ? primaryColor : '#e0e0e0',
                                        color: isWishlisted ? primaryColor : darkText
                                    }}
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                />
                                <Button
                                    size="large"
                                    icon={<ShareAltOutlined />}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderColor: '#e0e0e0'
                                    }}
                                />
                            </div>

                            {/* Product Meta */}
                            <div style={{
                                backgroundColor: lightBg,
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 24
                            }}>
                                <Space size={16} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L3 9V22H21V9L12 2Z" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M9 22V12H15V22" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Danh mục</Text>
                                            <Text strong style={{ display: 'block' }}>
                                                {productColors[0]?.product.category?.categoryName || "Khác"}
                                            </Text>
                                        </div>
                                    </div>

                                    <Divider type="vertical" style={{ height: 40 }} />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Thương hiệu</Text>
                                            <Text strong style={{ display: 'block' }}>
                                                {productColors[0]?.product.brand?.brandName || "Khác"}
                                            </Text>
                                        </div>
                                    </div>

                                    <Divider type="vertical" style={{ height: 40 }} />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 8V12L15 15" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Mã sản phẩm</Text>
                                            <Text strong style={{ display: 'block' }}>
                                                {productColors[0]?.product?.productCode || 'N/A'}
                                            </Text>
                                        </div>
                                    </div>
                                </Space>
                            </div>

                            {/* Product Description (collapsible) */}
                            <div style={{
                                border: `1px solid ${lightBg}`,
                                borderRadius: 12,
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    padding: 16,
                                    backgroundColor: lightBg,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <Text strong style={{ color: darkText }}>Mô tả sản phẩm</Text>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9L12 15L18 9" stroke={darkText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <Text>
                                        {product.description || "Sản phẩm chất lượng cao với thiết kế hiện đại, phù hợp với nhiều phong cách thời trang. Chất liệu vải mềm mại, thoáng khí mang lại cảm giác thoải mái khi sử dụng."}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Confirm Modal */}
                <Modal
                    title={null}
                    visible={confirmModalVisible}
                    onOk={handleConfirmAddToCart}
                    onCancel={() => setConfirmModalVisible(false)}
                    width={600}
                    footer={null}
                    closable={false}
                    bodyStyle={{ padding: 0 }}
                    centered
                >
                    <div style={{ padding: 24 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 24
                        }}>
                            <Title level={4} style={{ margin: 0 }}>Xác nhận thêm vào giỏ hàng</Title>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={() => setConfirmModalVisible(false)}
                            />
                        </div>

                        {selectedProductDetails && (
                            <div style={{ padding: '16px 0' }}>
                                <Row gutter={24} align="middle">
                                    <Col span={8}>
                                        <Image
                                            src={selectedProductDetails.productImage}
                                            alt={selectedProductDetails.productName}
                                            style={{
                                                width: '100%',
                                                borderRadius: 8,
                                                border: '1px solid #f0f0f0'
                                            }}
                                            preview={false}
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong style={{ fontSize: 16 }}>{selectedProductDetails.productName}</Text>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 12,
                                            marginBottom: 24
                                        }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Text type="secondary" style={{ width: 80 }}>Màu sắc:</Text>
                                                <Space>
                                                    <div style={{
                                                        width: 16,
                                                        height: 16,
                                                        backgroundColor: selectedProductDetails.color.colorCode,
                                                        borderRadius: '50%',
                                                        border: '1px solid #d9d9d9'
                                                    }} />
                                                    <Text>{selectedProductDetails.color.colorName}</Text>
                                                </Space>
                                            </div>

                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Text type="secondary" style={{ width: 80 }}>Kích cỡ:</Text>
                                                <Tag color={primaryColor} style={{ borderRadius: 4 }}>
                                                    {selectedProductDetails.size.sizeName}
                                                </Tag>
                                            </div>

                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Text type="secondary" style={{ width: 80 }}>Giá:</Text>
                                                <Text strong style={{ color: primaryColor, fontSize: 16 }}>
                                                    {selectedProductDetails.price.toLocaleString('vi-VN')}₫
                                                </Text>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: 12
                                        }}>
                                            <Button
                                                type="primary"
                                                onClick={handleConfirmAddToCart}
                                                icon={<CheckOutlined />}
                                                style={{
                                                    flex: 1,
                                                    height: 48,
                                                    fontWeight: 500
                                                }}
                                            >
                                                Xác nhận
                                            </Button>
                                            <Button
                                                onClick={() => setConfirmModalVisible(false)}
                                                style={{
                                                    flex: 1,
                                                    height: 48
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </App>
    );
};

export default ProductDisplay;