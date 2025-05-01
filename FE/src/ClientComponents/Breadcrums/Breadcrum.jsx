import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const Breadcrum = ({ product }) => {
    // Color palette
    const primaryColor = '#6C5CE7';
    const darkText = '#2D3436';

    return (
        <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '16px 0',
            marginBottom: 24,
            marginTop: 70
        }}>
            <Breadcrumb
                separator={<RightOutlined style={{
                    color: '#888',
                    fontSize: 12,
                    margin: '0 8px'
                }} />}
                style={{
                    fontSize: 14,
                    lineHeight: '22px'
                }}
            >
                <Breadcrumb.Item>
                    <Link to="/" style={{
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <HomeOutlined style={{ marginRight: 4 }} />
                        Trang chủ
                    </Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item key="all">
                    <Link to="/all-product" style={{ color: primaryColor }}>
                        Sản phẩm
                    </Link>
                </Breadcrumb.Item>

                {product?.category && (
                    <Breadcrumb.Item>
                        <Link to={`/shop?category=${product.category}`} style={{ color: primaryColor }}>
                            {product.category}
                        </Link>
                    </Breadcrumb.Item>
                )}

                <Breadcrumb.Item>
                    <Text strong style={{ color: darkText }}>
                        {product?.name || 'Sản phẩm'}
                    </Text>
                </Breadcrumb.Item>
            </Breadcrumb>
        </div>
    );
};

export default Breadcrum;