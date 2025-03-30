import React, { useState } from 'react';
import { Typography, Button, Row, Col, Alert, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png';
import hero_icon from '../Assets/hero_image.png';

const { Title, Text } = Typography;

const Hero = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);

    // Thông báo thành công
    const message = localStorage.getItem('successMessage');
    if (message) {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        localStorage.removeItem('successMessage');
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #fde1ff, #e1ffea 60%)',
                padding: '0 20px',
            }}
        >
            {successMessage && (
                <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    closable
                    onClose={() => setSuccessMessage('')}
                    style={{ marginBottom: 20 }}
                />
            )}
            <Row align="middle" justify="space-between" style={{ minHeight: '100vh' }}>
                {/* Hero Left */}
                {error ? (
                    <Text type="danger">{error}</Text>
                ) : (
                    <Col xs={24} md={12} style={{ textAlign: 'left', paddingLeft: window.innerWidth > 768 ? 180 : 30 }}>
                        <Space direction="vertical" size="large">
                            <Title level={3} style={{ color: '#090909', fontWeight: 600, margin: 0 }}>
                                NEW ARRIVALS ONLY
                            </Title>
                            <div>
                                <Space align="center" size="middle">
                                    <Text style={{ color: '#171717', fontSize: window.innerWidth > 768 ? 100 : 40, fontWeight: 700 }}>
                                        new
                                    </Text>
                                    <img
                                        src={hand_icon}
                                        alt="hand"
                                        style={{ width: window.innerWidth > 768 ? 80 : 50 }}
                                    />
                                </Space>
                                <Text style={{ color: '#171717', fontSize: window.innerWidth > 768 ? 100 : 40, fontWeight: 700, display: 'block' }}>
                                    collections
                                </Text>
                                <Text style={{ color: '#171717', fontSize: window.innerWidth > 768 ? 100 : 40, fontWeight: 700, display: 'block' }}>
                                    for everyone
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    background: '#ff4141',
                                    borderRadius: 50,
                                    height: window.innerWidth > 768 ? 70 : 45,
                                    width: window.innerWidth > 768 ? 310 : 200,
                                    fontSize: window.innerWidth > 768 ? 22 : 14,
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    marginTop: 30,
                                }}
                            >
                                Latest Collections
                                <img src={arrow_icon} alt="arrow" style={{ width: 20 }} />
                            </Button>
                        </Space>
                    </Col>
                )}

                {/* Hero Right */}
                <Col xs={0} md={12} style={{ textAlign: 'center' }}>
                    <img
                        src={hero_icon}
                        alt="hero"
                        style={{ width: window.innerWidth > 1024 ? 500 : window.innerWidth > 800 ? 400 : 300 }}
                    />
                </Col>
            </Row>
            <ToastContainer />
        </div>
    );
};

export default Hero;