import React, { useContext, useState, useEffect } from 'react';
import {
    Button, Card, Col, Row, Typography, Space, Divider, message,
    Modal, Descriptions, Image, Tag, Badge, App, Spin
} from 'antd';
import {
    ShoppingCartOutlined, CheckOutlined, CloseOutlined,
    HeartOutlined, ShareAltOutlined, StarFilled
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

    const selectedColorName = productColors.find(c => c.color.id === selectedColorId)?.color.colorName;
    const selectedSizeName = sizes.find(s => s.id === selectedSize)?.sizeName;

    const primaryColor = '#1890ff';
    const accentColor = '#ff4d4f';
    const lightBlue = '#e6f7ff';
    const borderColor = '#91d5ff';

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

    if (!product) return <Card>Sản phẩm không tồn tại</Card>;

    return (
        <App>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
                <Row gutter={[32, 32]}>
                    {/* Product Images Section */}
                    <Col xs={24} md={12}>
                        <Card
                            className="product-gallery-card"
                            bordered={false}
                            bodyStyle={{ padding: 0 }}
                            style={{
                                borderRadius: 12,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                paddingTop: '100%',
                                backgroundColor: '#fafafa',
                                borderBottom: '1px solid #f0f0f0'
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
                                        <Spin size="large" />
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: 16 }}>
                                <Row gutter={[8, 8]}>
                                    {(images.length > 0 ? images : [{ image: product.image }]).map((img, index) => (
                                        <Col key={index} xs={8} sm={6} md={4}>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    border: `2px solid ${mainImage === img.image ? primaryColor : '#f0f0f0'}`,
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    aspectRatio: '1/1',
                                                    backgroundColor: '#f8f8f8',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        borderColor: primaryColor
                                                    }
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
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    {/* Product Info Section */}
                    <Col xs={24} md={12}>
                        <Card
                            className="product-info-card"
                            bordered={false}
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                height: '100%'
                            }}
                            bodyStyle={{ padding: 24 }}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <Space size="middle" style={{ marginBottom: 8 }}>
                                    <Tag color="blue">{productColors[0]?.product?.category?.categoryName || "Khác"}</Tag>
                                    <Tag color="geekblue">{productColors[0]?.product?.brand?.brandName || "Khác"}</Tag>
                                </Space>

                                <Title level={2} style={{ marginBottom: 8 }}>{product.name}</Title>

                                <Space size={4} style={{ marginBottom: 16 }}>
                                    <Text type="secondary">Mã SP:</Text>
                                    <Text strong>{productColors[0]?.product?.productCode || 'N/A'}</Text>
                                </Space>

                                <div style={{ marginBottom: 24 }}>
                                    <Space size={4}>
                                        <StarFilled style={{ color: '#faad14' }} />
                                        <Text strong>4.9</Text>
                                        <Text type="secondary">(128 đánh giá)</Text>
                                    </Space>
                                </div>

                                <div style={{
                                    backgroundColor: '#fafafa',
                                    padding: 16,
                                    borderRadius: 8,
                                    marginBottom: 24
                                }}>
                                    <Title level={3} style={{ color: accentColor, marginBottom: 0 }}>
                                        {product.price?.toLocaleString('vi-VN')}₫
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {currentDetail ?
                                            `Còn ${currentDetail.quantity} sản phẩm (${selectedSizeName}, ${selectedColorName})` :
                                            "Vui lòng chọn màu và size"}
                                    </Text>
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{ display: 'block', marginBottom: 12 }}>MÀU SẮC</Text>
                                <Space wrap>
                                    {productColors.map((pc, index) => (
                                        <Button
                                            key={index}
                                            shape="round"
                                            size="middle"
                                            onClick={() => handleColorChange(pc.color.id, pc.id, pc.image)}
                                            style={{
                                                minWidth: 100,
                                                borderColor: selectedColorId === pc.color.id ? primaryColor : '#d9d9d9',
                                                backgroundColor: selectedColorId === pc.color.id ? lightBlue : 'white',
                                                color: selectedColorId === pc.color.id ? primaryColor : 'inherit',
                                                fontWeight: selectedColorId === pc.color.id ? 600 : 'normal',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}
                                        >
                                            {pc.color.colorCode && (
                                                <div style={{
                                                    width: 16,
                                                    height: 16,
                                                    backgroundColor: pc.color.colorCode,
                                                    borderRadius: '50%',
                                                    border: '1px solid #d9d9d9'
                                                }} />
                                            )}
                                            {pc.color.colorName}
                                        </Button>
                                    ))}
                                </Space>
                            </div>

                            {/* Size Selection */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text strong>KÍCH CỠ</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedSizeName ? `Đã chọn: ${selectedSizeName}` : 'Vui lòng chọn size'}
                                    </Text>
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
                                                    borderColor: selectedSize === size.id ? primaryColor : '#d9d9d9',
                                                    backgroundColor: selectedSize === size.id ? lightBlue : 'white',
                                                    color: selectedSize === size.id ? primaryColor : 'inherit',
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

                            {/* Action Buttons */}
                            <Space size={16} style={{ width: '100%', marginBottom: 24 }}>
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
                                        backgroundColor: primaryColor,
                                        borderColor: borderColor
                                    }}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </Button>
                                <Button
                                    size="large"
                                    icon={<HeartOutlined />}
                                    style={{ width: 48 }}
                                />
                                <Button
                                    size="large"
                                    icon={<ShareAltOutlined />}
                                    style={{ width: 48 }}
                                />
                            </Space>

                            {/* Product Details */}
                            <Card
                                type="inner"
                                title="Thông tin sản phẩm"
                                style={{ marginBottom: 16 }}
                            >
                                <Text>{product.description || 'Không có mô tả chi tiết'}</Text>
                            </Card>
                        </Card>
                    </Col>
                </Row>

                {/* Confirm Modal */}
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
                                            border: '1px solid #f0f0f0'
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
                                                    border: '1px solid #d9d9d9'
                                                }} />
                                                <Text>{selectedProductDetails.color.colorName}</Text>
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Kích cỡ">
                                            <Tag color="blue">{selectedProductDetails.size.sizeName}</Tag>
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