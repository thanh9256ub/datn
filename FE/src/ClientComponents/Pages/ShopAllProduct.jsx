import React, { useEffect, useState } from 'react';
import {
    Row, Col, Typography, Button, Card, Space, Divider,
    Badge, Rate, Tag, Image, Select, Slider, InputNumber, Checkbox
} from 'antd';
import { HeartOutlined, ShoppingCartOutlined, FireFilled, FilterOutlined } from '@ant-design/icons';
import { fetchProducts, fetchProductDetail } from '../Service/productService';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const ShopAllProduct = (props) => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [brands, setBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [inputValues, setInputValues] = useState([0, 5000000]);
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(8);

    // Color palette
    const primaryColor = '#6C5CE7';
    const lightBg = '#F8F9FA';
    const darkText = '#2D3436';
    const successColor = '#00B894';

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    useEffect(() => {
        let isMounted = true;

        const getProductsAndDetails = async () => {
            try {
                setLoading(true);
                const [productsResponse, productDetailsResponse] = await Promise.all([
                    fetchProducts(),
                    fetchProductDetail()
                ]);

                if (isMounted) {
                    const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
                    const detailsData = Array.isArray(productDetailsResponse.data) ? productDetailsResponse.data : [];

                    const mergedProducts = productsData.map((product) => {
                        const detail = detailsData.find((d) => d.product.id === product.id);
                        return {
                            ...product,
                            price: detail ? detail.price : 0,
                            isBestSeller: Math.random() > 0.7,
                            material: product.material?.materialName || product.material || 'Không xác định'
                        };
                    });

                    const uniqueBrands = [...new Set(
                        mergedProducts
                            .map(item => item.brand?.brandName)
                            .filter(brandName => brandName)
                    )];

                    setBrands(uniqueBrands);

                    const uniqueMaterials = [...new Set(
                        mergedProducts
                            .map(item => item.material)
                            .filter(material => material)
                    )];
                    setMaterials(uniqueMaterials);

                    const maxPrice = mergedProducts.reduce((max, item) => Math.max(max, item.price), 5000000);
                    setPriceRange([0, Math.min(maxPrice, 5000000)]);
                    setInputValues([0, Math.min(maxPrice, 5000000)]);

                    setProducts(mergedProducts);
                    setFilteredProducts(mergedProducts);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                if (isMounted) {
                    setLoading(false);
                    setProducts([]);
                    setFilteredProducts([]);
                }
            }
        };

        getProductsAndDetails();

        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedBrand, priceRange, sortOption, products, selectedMaterials]);

    const applyFilters = () => {
        let result = [...products];

        if (selectedBrand) {
            result = result.filter(item => item.brand?.brandName === selectedBrand);
        }

        if (selectedMaterials.length > 0) {
            result = result.filter(item =>
                selectedMaterials.includes(item.material)
            );
        }

        result = result.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => {
                    const nameA = a.productName?.toUpperCase() || '';
                    const nameB = b.productName?.toUpperCase() || '';
                    return nameA.localeCompare(nameB, 'vi');
                });
                break;
            case 'name-desc':
                result.sort((a, b) => {
                    const nameA = a.productName?.toUpperCase() || '';
                    const nameB = b.productName?.toUpperCase() || '';
                    return nameB.localeCompare(nameA, 'vi');
                });
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    };

    const handleMaterialChange = (checkedValues) => {
        setSelectedMaterials(checkedValues);
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
        setInputValues(value);
    };

    const handleInputChange = (index, value) => {
        const newValues = [...inputValues];
        newValues[index] = value || 0;
        setInputValues(newValues);

        // Auto update slider if values are valid
        if (!isNaN(newValues[0]) && !isNaN(newValues[1])) {
            setPriceRange([Number(newValues[0]), Number(newValues[1])]);
        }
    };

    const handleBrandChange = (value) => {
        setSelectedBrand(value);
    };

    const handleSortChange = (value) => {
        setSortOption(value);
    };

    const clearFilters = () => {
        setSelectedBrand(null);
        setSelectedMaterials([]);
        setPriceRange([0, 5000000]);
        setInputValues([0, 5000000]);
        setSortOption('default');
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prev => prev + 8);
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: 30 }}>
            {/* Banner */}
            <div style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 40,
                height: 600,
                marginTop: 70
            }}>
                <Image
                    src={props.banner}
                    alt="Shop banner"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    preview={false}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '40px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                }}>
                    <Title level={1} style={{
                        color: '#fff',
                        margin: 0,
                        fontSize: 36
                    }}>
                        Tất cả sản phẩm
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Khám phá bộ sưu tập đầy đủ của chúng tôi
                    </Text>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: 1600,
                margin: '0 auto',
                padding: '0 24px'
            }}>
                <Row gutter={[32, 32]}>
                    {/* Filter Sidebar */}
                    <Col xs={24} md={6}>
                        <Card
                            title={
                                <Space>
                                    <FilterOutlined />
                                    <Text strong>Bộ lọc</Text>
                                </Space>
                            }
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Thương hiệu</Text>
                                    <Select
                                        style={{ width: '100%', marginTop: '8px' }}
                                        placeholder="Tất cả thương hiệu"
                                        value={selectedBrand}
                                        onChange={handleBrandChange}
                                        allowClear
                                    >
                                        {brands.map(brand => (
                                            <Option key={brand} value={brand}>{brand}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Text strong>Chất liệu</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
                                            onChange={handleMaterialChange}
                                            value={selectedMaterials}
                                        >
                                            <Space direction="vertical">
                                                {materials.map((material, index) => (
                                                    <Checkbox
                                                        key={material + index}
                                                        value={material}
                                                        style={{ marginLeft: 0 }}
                                                    >
                                                        {material}
                                                    </Checkbox>
                                                ))}
                                            </Space>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Khoảng giá</Text>
                                    <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            value={inputValues[0]}
                                            onChange={(value) => handleInputChange(0, value)}
                                            min={0}
                                            max={5000000}
                                            placeholder="Từ"
                                        />
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            value={inputValues[1]}
                                            onChange={(value) => handleInputChange(1, value)}
                                            min={0}
                                            max={5000000}
                                            placeholder="Đến"
                                        />
                                    </div>
                                    <Slider
                                        range
                                        min={0}
                                        max={5000000}
                                        value={priceRange}
                                        onChange={handlePriceChange}
                                        tooltip={{ formatter: formatCurrency }}
                                    />
                                </div>

                                <Button
                                    type="default"
                                    onClick={clearFilters}
                                    block
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    {/* Product Listing */}
                    <Col xs={24} md={18}>
                        {/* Sort and Product Count */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 24
                        }}>
                            {/* <Text>
                                <span style={{ fontWeight: '600' }}>Hiển thị 1-{filteredProducts.length}</span> trong tổng số {filteredProducts.length} sản phẩm
                            </Text> */}

                            <span style={{ fontWeight: '600' }}>Hiển thị 1-{visibleProducts}</span> trong tổng số {filteredProducts.length} sản phẩm

                            <Select
                                style={{ width: '200px' }}
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <Option value="default">Mặc định</Option>
                                <Option value="price-asc">Giá: Thấp đến cao</Option>
                                <Option value="price-desc">Giá: Cao đến thấp</Option>
                                <Option value="name-asc">Tên: A-Z</Option>
                                <Option value="name-desc">Tên: Z-A</Option>
                            </Select>
                        </div>

                        <Row gutter={[24, 48]} style={{ marginBottom: "20px" }}>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <Col key={index} xs={12} sm={12} md={8} lg={6}>
                                        <Card loading style={{ borderRadius: 12 }} />
                                    </Col>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.slice(0, visibleProducts).map((product, index) => (
                                    <Col xs={12} sm={12} md={8} lg={6} key={index}>
                                        <Card
                                            hoverable
                                            onClick={() => history.push(`/product/${product.id}`)}
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
                                                        alt={product.productName}
                                                        src={product.mainImage}
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
                                                    {product.isBestSeller && (
                                                        <Tag style={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            left: 12,
                                                            backgroundColor: successColor,
                                                            color: '#fff',
                                                            fontWeight: 600,
                                                            border: 'none',
                                                            borderRadius: 4,
                                                            zIndex: 1
                                                        }}>
                                                        </Tag>
                                                    )}
                                                </div>
                                            }
                                            bodyStyle={{ padding: 16 }}
                                        >
                                            <div style={{ marginBottom: 8 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {product.brand?.brandName || 'Thương hiệu'}
                                                </Text>
                                            </div>
                                            <Title level={5} style={{
                                                marginBottom: 8,
                                                color: darkText,
                                                fontWeight: 600,
                                                height: 45,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {product.productName}
                                            </Title>

                                            {/* <div style={{ marginBottom: 12 }}>
                                                <Rate
                                                    disabled
                                                    defaultValue={4.5}
                                                    allowHalf
                                                    style={{
                                                        color: '#FDCB6E',
                                                        fontSize: 14
                                                    }}
                                                />
                                                <Text type="secondary" style={{
                                                    fontSize: 12,
                                                    marginLeft: 8
                                                }}>
                                                    (12)
                                                </Text>
                                            </div> */}

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
                                                    {formatCurrency(product.price)}
                                                </Text>
                                                {product.originalPrice && (
                                                    <Text delete type="secondary" style={{ fontSize: 14 }}>
                                                        {formatCurrency(product.originalPrice)}
                                                    </Text>
                                                )}
                                            </div>

                                            {/* <Button
                                                type="primary"
                                                icon={<ShoppingCartOutlined />}
                                                block
                                                style={{
                                                    backgroundColor: primaryColor,
                                                    borderColor: primaryColor,
                                                    borderRadius: 8
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle add to cart
                                                }}
                                            >
                                                Thêm vào giỏ
                                            </Button> */}
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Text type="secondary">Không tìm thấy sản phẩm phù hợp</Text>
                                </Col>
                            )}
                        </Row>

                        {filteredProducts.length > visibleProducts && (
                            <div style={{ textAlign: 'center', margin: '48px 0 0 0' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        width: '200px',
                                        height: '50px',
                                        borderRadius: '40px',
                                        backgroundColor: '#f0f0f0',
                                        color: '#787878',
                                        border: 'none',
                                        fontWeight: '500'
                                    }}
                                    onClick={loadMoreProducts}
                                >
                                    Xem thêm
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ShopAllProduct;