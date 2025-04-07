import React, { useContext, useState, useEffect } from 'react';
import {
    Button, Card, Col, Row, Typography, Space, Divider, message,
    Modal, Descriptions, Image, Tag, Badge, App, Rate, Progress
} from 'antd';
import {
    ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, CheckOutlined, CloseOutlined
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
    const [wishlisted, setWishlisted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const selectedColorName = productColors.find(c => c.color.id === selectedColorId)?.color.colorName;
    const selectedSizeName = sizes.find(s => s.id === selectedSize)?.sizeName;

    // Modern color palette
    const primaryColor = '#1890ff';
    const accentColor = '#ff4d4f';
    const darkColor = '#1a1a1a';
    const lightGray = '#f5f5f5';
    const borderColor = '#e8e8e8';

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
                        if (!selectedSize || !sizeResponse.some(s => s.id === selectedSize)) {
                            setSelectedSize(sizeResponse[0].id);
                        }
                    } else {
                        setSelectedSize(null);
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

    const handleColorChange = async (colorId, productColorId, newImage) => {
        setSelectedColorId(colorId);
        setSelectedProductColorId(productColorId);
        setMainImage(newImage || product.image || '');
        setActiveImageIndex(0);

        // Reset size when changing color
        setSizes([]);
        setSelectedSize(null);

        try {
            const sizeResponse = await fetchSizesByColor(product.id, colorId);
            setSizes(sizeResponse || []);

            if (sizeResponse.length > 0) {
                setSelectedSize(sizeResponse[0].id);
            }
        } catch (error) {
            message.error('Lỗi tải danh sách size');
        }
    };

    const handleImageClick = (img, index) => {
        setMainImage(img);
        setActiveImageIndex(index);
    };

    if (!product) return <Card>Sản phẩm không tồn tại</Card>;

    return (
        <App>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
                <Row gutter={[48, 32]} align="top">
                    {/* Product Images */}
                    <Col xs={24} md={10} lg={12}>
                        <div style={{
                            position: 'relative',
                            paddingTop: '100%',
                            backgroundColor: lightGray,
                            borderRadius: 8,
                            overflow: 'hidden',
                            marginBottom: 16
                        }}>
                            {mainImage && mainImage !== "image.png" ? (
                                <Image
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
                                    preview={false}
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
                                    Đang tải ảnh...
                                </div>
                            )}
                        </div>

                        {/* Thumbnail gallery */}
                        <div style={{ marginTop: 16 }}>
                            <Row gutter={[8, 8]}>
                                {(images.length > 0 ? images : [{ image: product.image }]).map((img, index) => (
                                    <Col key={index} xs={6} sm={4} md={6}>
                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                border: `2px solid ${activeImageIndex === index ? primaryColor : borderColor}`,
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                aspectRatio: '1/1',
                                                backgroundColor: lightGray,
                                                transition: 'all 0.2s ease',
                                                position: 'relative'
                                            }}
                                            onClick={() => {
                                                if (img.image) {
                                                    handleImageClick(img.image, index);
                                                }
                                            }}
                                        >
                                            <img
                                                src={img.image || 'https://via.placeholder.com/150?text=Ảnh+phụ'}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    padding: 8
                                                }}
                                            />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>

                    {/* Product Info */}
                    <Col xs={24} md={14} lg={12}>
                        <div style={{ paddingLeft: 8 }}>
                            {/* Product title and rating */}
                            <div style={{ marginBottom: 16 }}>
                                <Title level={2} style={{
                                    marginBottom: 8,
                                    fontWeight: 600,
                                    color: darkColor
                                }}>
                                    {product.name}
                                </Title>
                                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    <Rate
                                        disabled
                                        defaultValue={4.5}
                                        allowHalf
                                        style={{
                                            color: accentColor,
                                            fontSize: 16,
                                            marginRight: 8
                                        }}
                                    />
                                    <Text type="secondary" style={{ fontSize: 14 }}>(42 đánh giá)</Text>
                                </div> */}
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    Mã sản phẩm: {productColors[0]?.product?.productCode || 'N/A'}
                                </Text>
                            </div>

                            {/* Price section */}
                            <div style={{
                                backgroundColor: '#fafafa',
                                padding: '16px 12px',
                                borderRadius: 8,
                                marginBottom: 24,
                                border: `1px solid ${borderColor}`
                            }}>
                                <Text strong style={{
                                    fontSize: 28,
                                    color: accentColor,
                                    marginRight: 12
                                }}>
                                    {product.price?.toLocaleString('vi-VN')}₫
                                </Text>
                                {product.originalPrice && (
                                    <Text delete type="secondary" style={{ fontSize: 18 }}>
                                        {product.originalPrice.toLocaleString('vi-VN')}₫
                                    </Text>
                                )}
                                {product.discount && (
                                    <Tag color={accentColor} style={{
                                        marginLeft: 8,
                                        fontSize: 14,
                                        fontWeight: 600
                                    }}>
                                        -{product.discount}%
                                    </Tag>
                                )}

                                <div style={{ marginTop: 8 }}>
                                    {currentDetail ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text strong style={{ marginRight: 8 }}>Tình trạng:</Text>
                                            {currentDetail.quantity > 0 ? (
                                                <Tag color="success">Còn hàng</Tag>
                                            ) : (
                                                <Tag color="error">Hết hàng</Tag>
                                            )}
                                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                                ({currentDetail.quantity} sản phẩm)
                                            </Text>
                                        </div>
                                    ) : (
                                        <Text type="secondary">Vui lòng chọn màu và size</Text>
                                    )}
                                </div>
                            </div>

                            {/* Color selection */}
                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{
                                    display: 'block',
                                    marginBottom: 12,
                                    fontSize: 16,
                                    color: darkColor
                                }}>
                                    MÀU SẮC
                                </Text>
                                <Space wrap>
                                    {productColors.map((pc, index) => (
                                        <Button
                                            key={index}
                                            shape="round"
                                            size="middle"
                                            onClick={() => handleColorChange(pc.color.id, pc.id, pc.image)}
                                            style={{
                                                minWidth: 80,
                                                borderColor: selectedColorId === pc.color.id ? primaryColor : borderColor,
                                                backgroundColor: selectedColorId === pc.color.id ? '#e6f7ff' : 'white',
                                                color: selectedColorId === pc.color.id ? primaryColor : darkColor,
                                                fontWeight: selectedColorId === pc.color.id ? 600 : 'normal',
                                                height: 40,
                                                padding: '0 16px'
                                            }}
                                        >
                                            {pc.color.colorName}
                                        </Button>
                                    ))}
                                </Space>
                            </div>

                            {/* Size selection */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 12
                                }}>
                                    <Text strong style={{
                                        fontSize: 16,
                                        color: darkColor
                                    }}>
                                        KÍCH CỠ
                                    </Text>
                                    <Button type="link" size="small" style={{ padding: 0 }}>
                                        Hướng dẫn chọn size
                                    </Button>
                                </div>
                                <Space wrap>
                                    {sizes.length > 0 ? (
                                        sizes.map((size, index) => (
                                            <Button
                                                key={index}
                                                shape="round"
                                                size="large"
                                                onClick={() => setSelectedSize(size.id)}
                                                style={{
                                                    minWidth: 60,
                                                    height: 40,
                                                    fontSize: 14,
                                                    borderColor: selectedSize === size.id ? primaryColor : borderColor,
                                                    backgroundColor: selectedSize === size.id ? '#e6f7ff' : 'white',
                                                    color: selectedSize === size.id ? primaryColor : darkColor,
                                                    fontWeight: selectedSize === size.id ? 600 : 'normal'
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

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    block
                                    style={{
                                        height: 48,
                                        fontSize: 16,
                                        fontWeight: 500,
                                        backgroundColor: accentColor,
                                        borderColor: accentColor
                                    }}
                                    disabled={!currentDetail || currentDetail.quantity <= 0}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </Button>
                                <Button
                                    size="large"
                                    icon={<HeartOutlined />}
                                    style={{
                                        width: 48,
                                        borderColor: wishlisted ? accentColor : borderColor,
                                        color: wishlisted ? accentColor : darkColor
                                    }}
                                    onClick={() => setWishlisted(!wishlisted)}
                                />
                            </div>

                            {/* Share and info */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0',
                                borderTop: `1px solid ${borderColor}`,
                                borderBottom: `1px solid ${borderColor}`,
                                marginBottom: 24
                            }}>
                                <Button type="text" icon={<ShareAltOutlined />} style={{ color: darkColor }}>
                                    Chia sẻ
                                </Button>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    Đã bán: 124
                                </Text>
                            </div>

                            {/* Product meta */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', marginBottom: 8 }}>
                                    <Text strong style={{ minWidth: 100, color: darkColor }}>Danh mục:</Text>
                                    <Text>{productColors[0]?.product.category?.categoryName || "Khác"}</Text>
                                </div>
                                <div style={{ display: 'flex', marginBottom: 8 }}>
                                    <Text strong style={{ minWidth: 100, color: darkColor }}>Thương hiệu:</Text>
                                    <Text>{productColors[0]?.product.brand?.brandName || "Khác"}</Text>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Text strong style={{ minWidth: 100, color: darkColor }}>Vận chuyển:</Text>
                                    <Text>Miễn phí vận chuyển cho đơn từ 500.000₫</Text>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Confirmation Modal */}
                <Modal
                    title="Xác nhận thêm vào giỏ hàng"
                    visible={confirmModalVisible}
                    onOk={handleConfirmAddToCart}
                    onCancel={() => setConfirmModalVisible(false)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    width={600}
                    footer={[
                        <Button key="back" onClick={() => setConfirmModalVisible(false)} icon={<CloseOutlined />}>Hủy</Button>,
                        <Button key="submit" type="primary" onClick={handleConfirmAddToCart} icon={<CheckOutlined />}>Xác nhận thêm vào giỏ</Button>,
                    ]}
                >
                    {selectedProductDetails && (
                        <div style={{ padding: '16px 0' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Image
                                        src={selectedProductDetails.productImage}
                                        alt={selectedProductDetails.productName}
                                        style={{
                                            width: '100%',
                                            borderRadius: 8,
                                            border: `1px solid ${borderColor}`
                                        }}
                                        preview={false}
                                    />
                                </Col>
                                <Col span={16}>
                                    <Descriptions column={1}>
                                        <Descriptions.Item label="Tên sản phẩm">
                                            <Text strong>{selectedProductDetails.productName}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mã sản phẩm">
                                            <Tag color="blue">{productColors[0]?.product?.productCode || 'N/A'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Màu sắc">
                                            <Space>
                                                <div style={{
                                                    width: 16,
                                                    height: 16,
                                                    backgroundColor: selectedProductDetails.color.colorCode,
                                                    borderRadius: '50%',
                                                    border: `1px solid ${borderColor}`
                                                }} />
                                                <Text>{selectedProductDetails.color.colorName}</Text>
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Kích cỡ">
                                            <Tag color={primaryColor}>{selectedProductDetails.size.sizeName}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Giá">
                                            <Text strong style={{ color: accentColor, fontSize: 18 }}>
                                                {selectedProductDetails.price.toLocaleString('vi-VN')}₫
                                            </Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal>
            </div>
        </App>
    );
};

export default ProductDisplay;