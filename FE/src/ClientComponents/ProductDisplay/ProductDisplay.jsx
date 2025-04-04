import React, { useContext, useState, useEffect } from 'react';
import {
    Button, Card, Col, Row, Typography, Space, Divider, message,
    Modal, Descriptions, Image, Tag, Badge, App
} from 'antd';
import {
    ShoppingCartOutlined, CheckOutlined, CloseOutlined
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

    const primaryColor = '#722ed1';
    const lightPurple = '#f9f0ff';
    const borderColor = '#d3adf7';

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

        if (currentDetail && currentDetail.quantity === 0) {
            message.warning('Sản phẩm đã hết hàng');
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

            if (currentDetail && currentDetail.quantity === 0) {
                message.warning('Sản phẩm đã hết hàng');
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

    const isOutOfStock = currentDetail && currentDetail.quantity === 0;

    return (
        <App>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12}>
                        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', paddingTop: '100%', backgroundColor: '#f8f8f8' }}>
                                {mainImage && mainImage !== "image.png" ? (
                                    <img src={mainImage} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
                                ) : (
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                        Đang tải ảnh...
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: 16 }}>
                                <Row gutter={[8, 8]}>
                                    {(images.length > 0 ? images : [{ image: product.image }]).map((img, index) => (
                                        <Col key={index} xs={8} sm={4}>
                                            <div style={{ cursor: 'pointer', border: `2px solid ${mainImage === img.image ? primaryColor : '#f0f0f0'}`, borderRadius: 4, overflow: 'hidden', aspectRatio: '1/1', backgroundColor: '#f8f8f8', transition: 'all 0.3s' }} onClick={() => img.image && setMainImage(img.image)}>
                                                <img src={img.image || 'https://via.placeholder.com/150?text=Ảnh+phụ'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <div style={{ paddingLeft: 16 }}>
                            <Title level={2} style={{ marginBottom: 4, fontWeight: 600 }}>{product.name}-{productColors[0]?.product?.productCode || 'N/A'}</Title>
                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{ fontSize: 24, color: primaryColor, marginRight: 12 }}>${product.price?.toLocaleString() || 0}</Text>
                                <Text type="secondary">{currentDetail ? `Còn ${currentDetail.quantity} sản phẩm (${selectedSizeName}, ${selectedColorName})` : "Vui lòng chọn màu và size"}</Text>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>MÀU SẮC</Text>
                                <Space wrap>
                                    {productColors.map((pc, index) => (
                                        <Button
                                            key={index}
                                            shape="round"
                                            size="middle"
                                            onClick={() => handleColorChange(pc.color.id, pc.id, pc.image)}
                                            style={{
                                                minWidth: 80,
                                                borderColor: selectedColorId === pc.color.id ? primaryColor : '#d9d9d9',
                                                backgroundColor: selectedColorId === pc.color.id ? lightPurple : 'white',
                                                color: selectedColorId === pc.color.id ? primaryColor : 'inherit',
                                                fontWeight: selectedColorId === pc.color.id ? 600 : 'normal'
                                            }}
                                        >
                                            {pc.color.colorName}
                                        </Button>
                                    ))}
                                </Space>
                            </div>
                            <div style={{ marginBottom: 32 }}>
                                <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>KÍCH CỠ</Text>
                                <Space wrap>
                                    {sizes.length > 0 ? (
                                        sizes.map((size, index) => (
                                            <Button key={index} shape="circle" size="large" onClick={() => setSelectedSize(size.id)} style={{ width: 48, height: 48, fontSize: 15, borderColor: selectedSize === size.id ? primaryColor : '#d9d9d9', backgroundColor: selectedSize === size.id ? lightPurple : 'white', color: selectedSize === size.id ? primaryColor : 'inherit', fontWeight: selectedSize === size.id ? 600 : 'normal' }}>
                                                {size.sizeName}
                                            </Button>
                                        ))
                                    ) : (
                                        <Text type="secondary">Vui lòng chọn màu trước</Text>
                                    )}
                                </Space>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                block
                                disabled={isOutOfStock}
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    marginBottom: 24,
                                    backgroundColor: isOutOfStock ? '#d9d9d9' : primaryColor,
                                    borderColor: isOutOfStock ? '#d9d9d9' : borderColor
                                }}
                            >
                                {isOutOfStock ? 'SẢN PHẨM ĐÃ HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}
                            </Button>
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
                                                <Image src={selectedProductDetails.productImage} alt={selectedProductDetails.productName} style={{ width: '100%', borderRadius: 8, border: '1px solid #f0f0f0' }} preview={false} />
                                            </Col>
                                            <Col span={16}>
                                                <Descriptions column={1}>
                                                    <Descriptions.Item label="Tên sản phẩm"><Text strong>{selectedProductDetails.productName}</Text></Descriptions.Item>
                                                    <Descriptions.Item label="Mã sản phẩm"><Tag color="blue">{productColors[0]?.product?.productCode || 'N/A'}</Tag></Descriptions.Item>
                                                    <Descriptions.Item label="Màu sắc">
                                                        <Space>
                                                            <div style={{ width: 16, height: 16, backgroundColor: selectedProductDetails.color.colorCode, borderRadius: '50%', border: '1px solid #d9d9d9' }} />
                                                            <Text>{selectedProductDetails.color.colorName}</Text>
                                                        </Space>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Kích cỡ"><Tag color="purple">{selectedProductDetails.size.sizeName}</Tag></Descriptions.Item>
                                                    <Descriptions.Item label="Giá"><Text strong style={{ color: primaryColor, fontSize: 18 }}>{selectedProductDetails.price.toLocaleString('vi-VN')}₫</Text></Descriptions.Item>
                                                </Descriptions>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </Modal>
                            <Divider style={{ margin: '16px 0' }} />
                            <Space size="middle" style={{ color: '#666' }}>
                                <Text><Text strong>Danh mục:</Text> {productColors[0]?.product.category?.categoryName || "Khác"}</Text>
                                <Text><Text strong>Thương hiệu:</Text> {productColors[0]?.product.brand?.brandName || "Khác"}</Text>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </div>
        </App>
    );
};

export default ProductDisplay;