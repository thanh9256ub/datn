import React from 'react';
import { Typography, Button, Row, Col } from 'antd';
import exclusive_image from '../Assets/product_img/offer_banner.png';

const { Title, Text } = Typography;

const Offers = () => {
    return (
        <div
            style={{
                width: '65%',
                minHeight: window.innerWidth > 1024 ? '60vh' : window.innerWidth > 500 ? '40vh' : '50vh',
                background: 'linear-gradient(180deg, #fde1ff 0%, #e1ffea22 60%)',
                margin: '0 auto',
                padding: window.innerWidth > 1280 ? '0 140px' : window.innerWidth > 1024 ? '0 80px' : window.innerWidth > 800 ? '0 60px' : '0 20px',
                marginBottom: window.innerWidth > 1280 ? 150 : window.innerWidth > 1024 ? 120 : window.innerWidth > 800 ? 80 : 50,
            }}
        >
            <Row align="middle" justify="space-between" style={{ height: '100%' }}>
                {/* Offers Left */}
                <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Title
                        level={1}
                        style={{
                            color: '#171717',
                            fontSize: window.innerWidth > 1280 ? 80 : window.innerWidth > 1024 ? 40 : window.innerWidth > 800 ? 30 : window.innerWidth > 500 ? 22 : 16,
                            fontWeight: 600,
                            margin: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        Exclusive
                    </Title>
                    <Title
                        level={1}
                        style={{
                            color: '#171717',
                            fontSize: window.innerWidth > 1280 ? 80 : window.innerWidth > 1024 ? 40 : window.innerWidth > 800 ? 30 : window.innerWidth > 500 ? 22 : 16,
                            fontWeight: 600,
                            margin: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        Offers For You
                    </Title>
                    <Text
                        style={{
                            color: '#171717',
                            fontSize: window.innerWidth > 1280 ? 22 : window.innerWidth > 1024 ? 18 : window.innerWidth > 800 ? 16 : window.innerWidth > 500 ? 13 : 10,
                            fontWeight: 600,
                        }}
                    >
                        ONLY ON BEST SELLERS PRODUCTS
                    </Text>
                    <Button
                        type="primary"
                        style={{
                            width: window.innerWidth > 1280 ? 282 : window.innerWidth > 1024 ? 220 : window.innerWidth > 800 ? 160 : window.innerWidth > 500 ? 140 : 120,
                            height: window.innerWidth > 1280 ? 70 : window.innerWidth > 1024 ? 50 : window.innerWidth > 800 ? 40 : window.innerWidth > 500 ? 30 : 25,
                            borderRadius: 35,
                            background: '#ff4141',
                            border: 'none',
                            color: 'white',
                            fontSize: window.innerWidth > 1280 ? 22 : window.innerWidth > 1024 ? 18 : window.innerWidth > 800 ? 16 : window.innerWidth > 500 ? 12 : 10,
                            fontWeight: 500,
                            marginTop: window.innerWidth > 500 ? 30 : 12,
                        }}
                    >
                        Check now
                    </Button>
                </Col>

                {/* Offers Right */}
                <Col
                    xs={0} // Ẩn trên mobile
                    md={12}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: window.innerWidth > 1280 ? 50 : window.innerWidth > 1024 ? 30 : 10,
                    }}
                >
                    <img
                        src={exclusive_image}
                        alt="exclusive offer"
                        style={{
                            width: window.innerWidth > 1280 ? 500 : window.innerWidth > 1024 ? 300 : window.innerWidth > 800 ? 200 : 180,
                            marginTop: -50, // Giữ hiệu ứng nâng hình lên
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Offers;