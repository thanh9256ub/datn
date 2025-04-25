import React from 'react';
import { Layout, Typography, Card, Row, Col, Image, Space, Divider, Button } from 'antd';
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import logo from '../Assets/H2TL(1).png'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;


const Description = () => {

    return (
        <Layout style={{ background: '#fff', marginTop: "70px" }}>
            <Content style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
                {/* Header Section */}
                <Row justify="center" style={{ marginBottom: 40 }}>
                    <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                        <Image
                            src={logo}
                            alt="Nam H2TL Sneaker Logo"
                            style={{ maxWidth: 200, marginBottom: 16 }}
                            preview={false}
                        />
                        <Title level={2} style={{ color: '#1890ff' }}>
                            <ShopOutlined style={{ marginRight: 8 }} />
                            Giới Thiệu Về Nam H2TL Sneaker
                        </Title>
                        <Paragraph style={{ fontSize: 16 }}>
                            Chào mừng bạn đến với <Text strong>Nam H2TL Sneaker</Text> - điểm đến lý tưởng cho những tín đồ yêu thích giày sneaker chất lượng, phong cách và đẳng cấp.
                        </Paragraph>
                    </Col>
                </Row>

                {/* About Section */}
                <Card
                    title={<Title level={4}>Về Chúng Tôi</Title>}
                    bordered={false}
                    style={{ marginBottom: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        <Text strong>Nam H2TL Sneaker</Text> được thành lập với đam mê mang đến những đôi giày sneaker chính hãng, đa phong cách từ các thương hiệu nổi tiếng như Nike, Adidas, Puma, và nhiều hơn nữa. Chúng tôi tự hào cung cấp các sản phẩm chất lượng cao, đảm bảo sự thoải mái và phong cách cho mọi khách hàng, từ những người yêu thời trang đường phố đến các vận động viên.
                    </Paragraph>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        Với hơn 5 năm kinh nghiệm trong ngành, Nam H2TL Sneaker không chỉ là nơi mua sắm, mà còn là cộng đồng dành cho những người đam mê sneaker, nơi bạn có thể tìm thấy những mẫu giày hot trend và phiên bản giới hạn.
                    </Paragraph>
                </Card>

                {/* Mission & Values Section */}
                <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
                    <Col xs={24} md={12}>
                        <Card
                            title={<Title level={4}>Sứ Mệnh</Title>}
                            bordered={false}
                            style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                                Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với các sản phẩm chính hãng, dịch vụ tận tâm và giá cả cạnh tranh. Nam H2TL Sneaker hướng đến việc truyền cảm hứng cho phong cách sống năng động và tự tin thông qua những đôi giày sneaker đẳng cấp.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card
                            title={<Title level={4}>Giá Trị Cốt Lõi</Title>}
                            bordered={false}
                            style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <ul style={{ paddingLeft: 20, fontSize: 16, lineHeight: 1.8 }}>
                                <li><Text strong>Chất lượng:</Text> Chỉ cung cấp giày sneaker chính hãng 100%.</li>
                                <li><Text strong>Phong cách:</Text> Đa dạng mẫu mã, từ cổ điển đến hiện đại.</li>
                                <li><Text strong>Khách hàng:</Text> Đặt trải nghiệm khách hàng lên hàng đầu.</li>
                                <li><Text strong>Cộng đồng:</Text> Xây dựng cộng đồng yêu sneaker gắn kết.</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>

                {/* Contact Section */}
                <Card
                    title={<Title level={4}>Liên Hệ Với Chúng Tôi</Title>}
                    bordered={false}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="middle" style={{ fontSize: 16 }}>
                                <Space>
                                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                                    <Text>Địa chỉ: 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội </Text>
                                </Space>
                                <Space>
                                    <PhoneOutlined style={{ color: '#1890ff' }} />
                                    <Text>Hotline: 0917294134</Text>
                                </Space>
                                <Space>
                                    <MailOutlined style={{ color: '#1890ff' }} />
                                    <Text>Email: thanh9256ub@gmail.com</Text>
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShopOutlined />}
                                href="/all-product"
                                style={{ borderRadius: 8 }}
                            >
                                Khám Phá Sản Phẩm
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Divider />
                <Paragraph style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>
                    © 2025 Nam H2TL Sneaker. All Rights Reserved.
                </Paragraph>
            </Content>
        </Layout>
    );
};

export default Description;