import React from 'react';
import { Typography, Divider, Row, Col, Space } from 'antd';
import footer_logo from '../Assets/H2TL(1).png'; // Logo từ Navbar
import instagram_icon from '../Assets/instagram_icon.png';
import pincester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const { Text } = Typography;

const Footer = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: window.innerWidth > 800 ? 50 : 20,
                padding: '20px 0',
                background: '#f5e6ff', // Nền tím nhạt
            }}
        >
            {/* Footer Logo */}
            <Space align="center" size={window.innerWidth > 800 ? 20 : 10}>
                <img
                    src={footer_logo}
                    alt="logo"
                    style={{ width: window.innerWidth > 800 ? 210 : 80 }} // Tăng kích thước logo
                />
            </Space>

            {/* Footer Links */}
            <Row
                justify="center"
                style={{
                    display: 'flex',
                    gap: window.innerWidth > 800 ? 50 : 14,
                }}
            >
                {['Company', 'Product', 'Offices', 'About', 'Contact Us'].map((link, index) => (
                    <Col key={index}>
                        <Text
                            style={{
                                color: '#252525',
                                fontSize: window.innerWidth > 800 ? 20 : 14,
                                cursor: 'pointer',
                            }}
                        >
                            {link}
                        </Text>
                    </Col>
                ))}
            </Row>

            {/* Footer Social Icons */}
            <Space size={window.innerWidth > 800 ? 20 : 10}>
                {[instagram_icon, pincester_icon, whatsapp_icon].map((icon, index) => (
                    <div
                        key={index}
                        style={{
                            padding: window.innerWidth > 800 ? '10px 10px 6px 10px' : '5px 5px 3px 5px',
                            background: '#fff',
                            border: '1px solid #ebebeb',
                        }}
                    >
                        <img
                            src={icon}
                            alt="social icon"
                            style={{ width: window.innerWidth > 800 ? 'auto' : 22 }}
                        />
                    </div>
                ))}
            </Space>

            {/* Footer Copyright */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 30,
                    width: '100%',
                    marginBottom: 30,
                }}
            >
                <Divider
                    style={{
                        width: '80%',
                        borderRadius: 10,
                        height: 3,
                        background: '#c7c7c7',
                        border: 'none',
                        margin: 0,
                    }}
                />
                <Text
                    style={{
                        color: '#1a1a1a',
                        fontSize: window.innerWidth > 800 ? 20 : 14,
                    }}
                >
                    Copyright @ 2025 - All Right Reserved.
                </Text>
            </div>
        </div>
    );
};

export default Footer;