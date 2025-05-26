import React, { useCallback, useEffect, useState } from 'react';
import {
    Row, Col, Typography, Button, Card, Space, Divider,
    Badge, Rate, Tag, Image, Select, Slider, InputNumber, Checkbox,
    Pagination, Input
} from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchProducts, fetchProductDetail, fetchProductColorsByProduct } from '../Service/productService';
import { useHistory } from 'react-router-dom';
import { fetchProductColorsByProductList } from '../../admin/products/service/ProductService';
import useWebSocket from '../../hook/useWebSocket';
const { Title, Text } = Typography;
const { Option } = Select;

const ShopAllProduct = (props) => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [inputValues, setInputValues] = useState([0, 5000000]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');


    const [productColors, setProductColors] = useState({});
    const { messages, isConnected } = useWebSocket("/topic/product-updates");
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

    const applyFilters = useCallback(() => {
        let result = [...products];

        // Lọc theo tên sản phẩm (luôn áp dụng)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.productName?.toLowerCase().includes(term)
            );
        }

        // Lọc theo các thuộc tính khác (kết hợp AND giữa các nhóm, OR trong từng nhóm)
        result = result.filter(item => {
            // Kiểm tra brand (nếu có chọn)
            const brandMatch = !selectedBrand || item.brand?.brandName === selectedBrand;

            // Kiểm tra material (OR trong nhóm)
            const materialMatch = selectedMaterials.length === 0 ||
                selectedMaterials.includes(item.material);

            // Kiểm tra color (OR trong nhóm)
            const colorMatch = selectedColors.length === 0 ||
                selectedColors.some(color => item.colors?.includes(color));

            // Kiểm tra size (đặc biệt - kiểm tra trong details)
            const sizeMatch = selectedSizes.length === 0 ||
                (item.details && item.details.some(detail =>
                    selectedSizes.includes(detail.size?.sizeName || detail.size)
                ));

            // Kiểm tra giá
            const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];

            // Tất cả điều kiện phải thỏa mãn (AND giữa các nhóm)
            return brandMatch && materialMatch && colorMatch && sizeMatch && priceMatch;
        });

        // Sắp xếp
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
        setCurrentPage(1);
    }, [products, searchTerm, selectedBrand, selectedMaterials, selectedColors, selectedSizes, priceRange, sortOption]);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const getProductsAndDetails = async () => {
            try {
                setLoading(true);

                const [productsResponse, productDetailsResponse] = await Promise.all([
                    fetchProducts({ signal: abortController.signal }),
                    fetchProductDetail({ signal: abortController.signal })
                ]);

                if (!isMounted) return;

                const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
                const detailsData = Array.isArray(productDetailsResponse.data) ? productDetailsResponse.data : [];

                // Tạo map để lưu tất cả các biến thể của sản phẩm
                const variantsMap = detailsData.reduce((acc, detail) => {
                    if (!acc[detail.product.id]) {
                        acc[detail.product.id] = {
                            product: detail.product,
                            details: [],
                            colors: new Set(),
                            sizes: new Set(),
                            materials: new Set()
                        };
                    }
                    acc[detail.product.id].details.push(detail);

                    // Thêm các thuộc tính vào Set để lấy unique values
                    if (detail.color?.colorName || detail.color) {
                        acc[detail.product.id].colors.add(detail.color?.colorName || detail.color);
                    }
                    if (detail.size?.sizeName || detail.size) {
                        acc[detail.product.id].sizes.add(detail.size?.sizeName || detail.size);
                    }
                    if (detail.product.material?.materialName || detail.product.material) {
                        acc[detail.product.id].materials.add(detail.product.material?.materialName || detail.product.material);
                    }

                    return acc;
                }, {});

                // Chuẩn bị dữ liệu sản phẩm để hiển thị
                const mergedProducts = Object.values(variantsMap).map(variant => {
                    // Lấy giá nhỏ nhất trong các biến thể
                    const minPrice = Math.min(...variant.details.map(d => d.price));

                    return {
                        ...variant.product,
                        price: minPrice,
                        isBestSeller: Math.random() > 0.7,
                        colors: Array.from(variant.colors),
                        sizes: Array.from(variant.sizes),
                        material: Array.from(variant.materials)[0] || 'Không xác định',
                        details: variant.details
                    };
                });

                // Lấy danh sách unique cho các bộ lọc
                const uniqueBrands = [...new Set(
                    mergedProducts
                        .map(item => item.brand?.brandName)
                        .filter(brandName => brandName)
                )];

                const uniqueMaterials = [...new Set(
                    mergedProducts.flatMap(item =>
                        item.details.map(d =>
                            d.product.material?.materialName || d.product.material
                        ).filter(Boolean)
                    )
                )];

                const uniqueColors = [...new Set(
                    mergedProducts.flatMap(item => item.colors)
                )];

                const uniqueSizes = [...new Set(
                    mergedProducts.flatMap(item => item.sizes)
                )];

                const maxPrice = mergedProducts.reduce((max, item) => Math.max(max, item.price), 5000000);
                const maxPriceValue = Math.min(maxPrice, 5000000);

                if (isMounted) {
                    setBrands(uniqueBrands);
                    setMaterials(uniqueMaterials);
                    setColors(uniqueColors);
                    setSizes(uniqueSizes);
                    setPriceRange([0, maxPriceValue]);
                    setInputValues([0, maxPriceValue]);
                    setProducts(mergedProducts);
                    setLoading(false);
                }
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted) {
                    console.error('Error:', error);
                    setLoading(false);
                    setProducts([]);
                    setFilteredProducts([]);
                }
            }
        };

        getProductsAndDetails();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

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
        setSelectedColors([]);
        setSelectedSizes([]);
        setPriceRange([0, 5000000]);
        setInputValues([0, 5000000]);
        setSortOption('default');
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    // Tính toán sản phẩm hiển thị trên trang hiện tại
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Tìm kiếm sản phẩm</Text>
                                    <Input
                                        placeholder="Nhập tên sản phẩm"
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ marginTop: 8 }}
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
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
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Chất liệu ({materials.length})</Text>
                                    <div style={{ marginTop: 8, maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                                        <Checkbox.Group style={{ width: '100%' }} onChange={handleMaterialChange} value={selectedMaterials}>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                {materials.map((material, index) => {
                                                    const count = products.filter(p =>
                                                        p.material === material &&
                                                        (!selectedBrand || p.brand?.brandName === selectedBrand) &&
                                                        (selectedColors.length === 0 || selectedColors.some(c => p.colors?.includes(c))) &&
                                                        (selectedSizes.length === 0 || selectedSizes.some(s => p.sizes?.includes(s))) &&
                                                        p.price >= priceRange[0] && p.price <= priceRange[1]
                                                    ).length;

                                                    return (
                                                        <Checkbox
                                                            key={material + index}
                                                            value={material}
                                                            style={{ marginLeft: 0 }}
                                                            disabled={count === 0 && !selectedMaterials.includes(material)}
                                                        >
                                                            {material} ({count})
                                                        </Checkbox>
                                                    );
                                                })}
                                            </Space>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Màu sắc</Text>
                                    <div style={{
                                        marginTop: 8,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        paddingRight: '8px'
                                    }}>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
                                            onChange={(checkedValues) => setSelectedColors(checkedValues)}
                                            value={selectedColors}
                                        >
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                                gap: '8px'
                                            }}>
                                                {colors.map((color, index) => (
                                                    <div key={color + index} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        <Checkbox value={color} style={{ marginRight: 8 }}>
                                                            <div style={{
                                                                display: 'inline-block',
                                                                width: 16,
                                                                height: 16,
                                                                backgroundColor: getColorCode(color),
                                                                borderRadius: '50%',
                                                                border: '1px solid #d9d9d9',
                                                                marginRight: 8,
                                                                verticalAlign: 'middle'
                                                            }} />
                                                            <span style={{
                                                                fontSize: 14,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: '80px',
                                                                display: 'inline-block'
                                                            }}>
                                                                {color}
                                                            </span>
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                            </div>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Kích thước</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
                                            onChange={(checkedValues) => setSelectedSizes(checkedValues)}
                                            value={selectedSizes}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                alignItems: 'center'
                                            }}>
                                                {sizes.map((size, index) => (
                                                    <Checkbox
                                                        key={size + index}
                                                        value={size}
                                                        style={{
                                                            margin: 0,
                                                            padding: '0 12px',
                                                            height: 32,
                                                            minWidth: 40,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            lineHeight: '30px',
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: 4,
                                                            backgroundColor: selectedSizes.includes(size) ? primaryColor : '#fff',
                                                            color: selectedSizes.includes(size) ? '#fff' : darkText,
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {size}
                                                    </Checkbox>
                                                ))}
                                            </div>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
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
                            <span style={{ fontWeight: '600' }}>
                                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredProducts.length)}
                                trong tổng số {filteredProducts.length} sản phẩm
                            </span>

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
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product, index) => (
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
                                                            padding: 0
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
                                            {productColors[product.id] && productColors[product.id].length > 0 && (
                                                <div style={{ display: 'flex', marginTop: 8 }}>
                                                    {productColors[product.id].map((color, index) => (
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
                                            {product.colors && product.colors.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>Màu sắc có sẵn:</Text>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                                        {product.colors.map((color, i) => (
                                                            <Tag
                                                                key={i}
                                                                style={{
                                                                    backgroundColor: getColorCode(color),
                                                                    color: '#fff',
                                                                    borderRadius: '50%',
                                                                    width: 20,
                                                                    height: 20,
                                                                    textAlign: 'center',
                                                                    lineHeight: '20px'
                                                                }}
                                                            >
                                                            </Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hiển thị các size có sẵn */}
                                            {product.sizes && product.sizes.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>Size có sẵn:</Text>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                                        {product.sizes.map((size, i) => (
                                                            <Tag key={i}>{size}</Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Text type="secondary">Không tìm thấy sản phẩm phù hợp</Text>
                                </Col>
                            )}
                        </Row>

                        {filteredProducts.length > pageSize && (
                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredProducts.length}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    style={{ marginTop: 24 }}
                                />
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ShopAllProduct;