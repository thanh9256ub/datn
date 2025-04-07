import React from 'react';
import { Typography, Divider, Row, Col, Space, Grid, Button } from 'antd';
import footer_logo from '../Assets/H2TL(1).png';
import instagram_icon from '../Assets/instagram_icon.png';
import pincester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const Footer = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Color palette consistent with your design
    const primaryColor = '#6C5CE7';
    const lightBg = '#F8F9FA';
    const darkText = '#2D3436';
    const lightPurple = '#f9f0ff';

    return (
        <div style={{
            backgroundColor: lightPurple,
            padding: isMobile ? '40px 16px' : '64px 24px',
            borderTop: `1px solid ${primaryColor}20`
        }}>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                {/* Main Footer Content */}
                <Row gutter={[48, 48]} justify="space-between">
                    {/* Logo and Description */}
                    <Col xs={24} md={8}>
                        <div style={{ marginBottom: 24 }}>
                            <img
                                src={footer_logo}
                                alt="logo"
                                style={{
                                    width: isMobile ? 120 : 160,
                                    marginBottom: 16
                                }}
                            />
                            <Text style={{
                                display: 'block',
                                color: darkText,
                                fontSize: isMobile ? 14 : 16
                            }}>
                                Chúng tôi mang đến những sản phẩm chất lượng cao với thiết kế hiện đại, phù hợp với mọi phong cách.
                            </Text>
                        </div>
                        <Space size={16}>
                            {[
                                <FacebookOutlined style={{ fontSize: 20, color: primaryColor }} />,
                                <InstagramOutlined style={{ fontSize: 20, color: primaryColor }} />,
                                <TwitterOutlined style={{ fontSize: 20, color: primaryColor }} />,
                                <YoutubeOutlined style={{ fontSize: 20, color: primaryColor }} />
                            ].map((Icon, index) => (
                                <Button
                                    key={index}
                                    type="text"
                                    shape="circle"
                                    icon={Icon}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        border: `1px solid ${primaryColor}30`,
                                        backgroundColor: '#fff'
                                    }}
                                />
                            ))}
                        </Space>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={12} md={5}>
                        <Title level={5} style={{
                            color: darkText,
                            marginBottom: 24,
                            fontWeight: 600
                        }}>
                            LIÊN KẾT NHANH
                        </Title>
                        {['Trang chủ', 'Sản phẩm', 'Bộ sưu tập', 'Về chúng tôi', 'Liên hệ'].map((link, index) => (
                            <div key={index} style={{ marginBottom: 12 }}>
                                <Text style={{
                                    color: darkText,
                                    fontSize: isMobile ? 14 : 16,
                                    cursor: 'pointer',
                                    '&:hover': { color: primaryColor }
                                }}>
                                    {link}
                                </Text>
                            </div>
                        ))}
                    </Col>

                    {/* Customer Service */}
                    <Col xs={12} md={5}>
                        <Title level={5} style={{
                            color: darkText,
                            marginBottom: 24,
                            fontWeight: 600
                        }}>
                            HỖ TRỢ KHÁCH HÀNG
                        </Title>
                        {['Trung tâm trợ giúp', 'Theo dõi đơn hàng', 'Chính sách đổi trả', 'Hướng dẫn chọn size', 'Câu hỏi thường gặp'].map((link, index) => (
                            <div key={index} style={{ marginBottom: 12 }}>
                                <Text style={{
                                    color: darkText,
                                    fontSize: isMobile ? 14 : 16,
                                    cursor: 'pointer'
                                }}>
                                    {link}
                                </Text>
                            </div>
                        ))}
                    </Col>

                    {/* Contact Info */}
                    <Col xs={24} md={6}>
                        <Title level={5} style={{
                            color: darkText,
                            marginBottom: 24,
                            fontWeight: 600
                        }}>
                            LIÊN HỆ
                        </Title>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: 'block', color: darkText }}>Địa chỉ:</Text>
                            <Text style={{ color: darkText }}>123 Đường ABC, Quận 1, TP.HCM</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: 'block', color: darkText }}>Email:</Text>
                            <Text style={{ color: darkText }}>contact@h2tl.com</Text>
                        </div>
                        <div>
                            <Text strong style={{ display: 'block', color: darkText }}>Điện thoại:</Text>
                            <Text style={{ color: darkText }}>+84 123 456 789</Text>
                        </div>
                    </Col>
                </Row>

                {/* Divider */}
                <Divider style={{
                    borderColor: `${primaryColor}20`,
                    margin: '40px 0'
                }} />

                {/* Copyright Section */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text style={{
                            color: darkText,
                            fontSize: isMobile ? 12 : 14
                        }}>
                            © 2025 H2TL. All rights reserved.
                        </Text>
                    </Col>
                    <Col>
                        <Space size={16}>
                            <Text style={{
                                color: darkText,
                                fontSize: isMobile ? 12 : 14,
                                cursor: 'pointer'
                            }}>
                                Điều khoản dịch vụ
                            </Text>
                            <Text style={{
                                color: darkText,
                                fontSize: isMobile ? 12 : 14,
                                cursor: 'pointer'
                            }}>
                                Chính sách bảo mật
                            </Text>
                        </Space>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Footer;