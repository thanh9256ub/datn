import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Select, Slider, Button, Divider, Typography, Image, Space, InputNumber } from 'antd';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Item/Item.';
import { fetchProducts, fetchProductDetail } from '../Service/productService';

const { Title, Text } = Typography;
const { Option } = Select;

const ShopAllProduct = (props) => {
    const { all_product } = useContext(ShopContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 99999999]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [inputValues, setInputValues] = useState([0, 99999999]);

    // Format currency VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value).replace('₫', 'VNĐ');
    };

    useEffect(() => {
        let isMounted = true;

        const getProductsAndDetails = async () => {
            try {
                const productsResponse = await fetchProducts();
                console.log("===productsResponse===" + productsResponse.data);

                const productDetailsResponse = await fetchProductDetail();

                if (isMounted) {
                    const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
                    const detailsData = Array.isArray(productDetailsResponse.data) ? productDetailsResponse.data : [];

                    const mergedProducts = productsData.map((product) => {
                        const detail = detailsData.find((d) => d.product.id === product.id);
                        return {
                            ...product,
                            price: detail ? detail.price : 0,
                        };
                    });

                    const uniqueBrands = [...new Set(mergedProducts.map(item => item.brand))];
                    setBrands(uniqueBrands);

                    // Tính giá cao nhất để set max cho slider
                    const maxPrice = mergedProducts.reduce((max, item) => Math.max(max, item.price), 99999999);
                    setPriceRange([0, Math.min(maxPrice, 99999999)]);
                    setInputValues([0, Math.min(maxPrice, 99999999)]);

                    setProducts(mergedProducts);
                    setFilteredProducts(mergedProducts);
                }
            } catch (error) {
                console.error('Error fetching products or details:', error);
                if (isMounted) {
                    setProducts([]);
                    setFilteredProducts([]);
                }
            }
        };

        getProductsAndDetails();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedBrand, priceRange, sortOption, products]);

    const applyFilters = () => {
        let result = [...products];

        if (selectedBrand) {
            result = result.filter(item => item.brand === selectedBrand);
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
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
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
        setPriceRange([0, 99999999]);
        setInputValues([0, 99999999]);
        setSortOption('default');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Banner */}
            <Image
                src={props.banner}
                alt="Shop banner"
                style={{ width: '100%', marginBottom: '24px', borderRadius: '8px' }}
                preview={false}
            />

            {/* Main Content Area */}
            <Row gutter={[24, 24]}>
                {/* Filter Sidebar - Left */}
                <Col xs={24} md={6}>
                    <Card title="Bộ lọc" style={{ marginBottom: '24px' }}>
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
                                <Text strong>Khoảng giá</Text>
                                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        value={inputValues[0]}
                                        onChange={(value) => handleInputChange(0, value)}
                                        min={0}
                                        max={99999999}
                                        placeholder="Từ"
                                    />
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        value={inputValues[1]}
                                        onChange={(value) => handleInputChange(1, value)}
                                        min={0}
                                        max={99999999}
                                        placeholder="Đến"
                                    />
                                </div>
                                <Slider
                                    range
                                    min={0}
                                    max={99999999}
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    tipFormatter={formatCurrency}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>{formatCurrency(priceRange[0])}</Text>
                                    <Text>{formatCurrency(priceRange[1])}</Text>
                                </div>
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

                {/* Product Listing - Right */}
                <Col xs={24} md={18}>
                    {/* Sort and Product Count - Top Right */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Text>
                            <span style={{ fontWeight: '600' }}>Hiển thị 1-{filteredProducts.length}</span> trong tổng số {filteredProducts.length} sản phẩm
                        </Text>

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

                    {/* Products Grid */}
                    <Row gutter={[16, 24]}>
                        {filteredProducts.map((item, i) => (
                            <Col key={i} xs={12} sm={12} md={8} lg={6}>
                                <Item
                                    id={item.id}
                                    product={item}
                                    price={item.price}
                                    formatCurrency={formatCurrency}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* Load More Button */}
                    <div style={{ textAlign: 'center', margin: '48px 0' }}>
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
                        >
                            Xem thêm
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ShopAllProduct;