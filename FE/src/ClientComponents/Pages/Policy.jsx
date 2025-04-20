import React from 'react';
import { Card, Divider, Typography, List, Collapse, Row, Col, Image } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import image from '../Assets/H2TL(1).png';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Policy = () => {
    return (
        <div className="policy-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px' }}>
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ color: '#1890ff' }}>H2TL SNEAKER</Title>
                        <Paragraph style={{ fontSize: 16 }}>
                            <Text strong>H2TL Sneaker</Text> tự hào là địa chỉ uy tín hàng đầu chuyên phân phối các dòng giày sneaker nam chính hãng với chất lượng đẳng cấp và giá cả hợp lý.
                            Với phương châm "<Text strong>Chất lượng tạo nên đẳng cấp</Text>", chúng tôi cam kết mang đến cho khách hàng những sản phẩm tốt nhất cùng trải nghiệm mua sắm hoàn hảo.
                        </Paragraph>
                        <Divider orientation="left">Thông tin cửa hàng</Divider>
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                {
                                    icon: <EnvironmentOutlined />,
                                    title: 'Địa chỉ',
                                    content: 'Số 123, đường ABC, phường XYZ, quận 1, TP.HCM'
                                },
                                {
                                    icon: <PhoneOutlined />,
                                    title: 'Hotline',
                                    content: '1900 1234 - 0987 654 321'
                                },
                                {
                                    icon: <MailOutlined />,
                                    title: 'Email',
                                    content: 'support@h2tlsneaker.com'
                                },
                                {
                                    icon: <ClockCircleOutlined />,
                                    title: 'Giờ mở cửa',
                                    content: '8:00 - 21:00 tất cả các ngày trong tuần'
                                }
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item.icon}
                                        title={item.title}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Image
                            src={image}
                            alt="Cửa hàng H2TL Sneaker"
                            preview={false}
                        />
                    </Col>
                </Row>
            </Card>
            <Card>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                    CHÍNH SÁCH MUA HÀNG
                </Title>

                <Divider orientation="left">
                    <Title level={4}>Thông tin chung</Title>
                </Divider>
                <Paragraph>
                    Chào mừng bạn đến với cửa hàng của chúng tôi. Dưới đây là các chính sách mua hàng áp dụng khi bạn sử dụng dịch vụ của chúng tôi.
                </Paragraph>

                <Collapse accordion defaultActiveKey={['1']}>
                    <Panel header="1. Chính sách đặt hàng" key="1">
                        <List
                            size="small"
                            dataSource={[
                                'Mỗi đơn hàng tối đa 10 sản phẩm cùng loại',
                                'Khách hàng cần cung cấp đầy đủ thông tin giao hàng chính xác',
                                'Chúng tôi có quyền từ chối đơn hàng nếu phát hiện hành vi mua sỉ giá lẻ'
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>

                    <Panel header="2. Chính sách mã khuyến mãi" key="2">
                        <List
                            size="small"
                            dataSource={[
                                'Chỉ áp dụng khi khách hàng đã đăng nhập tài khoản',
                                'Mã khuyến mãi có thể sử dụng được nhiều lần',
                                'Không áp dụng đồng thời nhiều mã giảm giá cho 1 đơn hàng',
                                'Có hiệu lực trong thời gian quy định'
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>

                    <Panel header="3. Chính sách thanh toán" key="3">
                        <List
                            size="small"
                            dataSource={[
                                'Thanh toán qua VNPay',
                                'Thanh toán khi nhận hàng (COD)',
                                'Đơn hàng sẽ được xử lý sau khi thanh toán thành công'
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>

                    <Panel header="4. Chính sách vận chuyển" key="4">
                        <List
                            size="small"
                            dataSource={[
                                'Giao hàng toàn quốc trong 2-5 ngày làm việc',
                                'Hỗ trợ đổi trả nếu sản phẩm bị lỗi do vận chuyển',
                                'Khách hàng chịu trách nhiệm kiểm tra hàng trước khi nhận'
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>

                    <Panel header="5. Chính sách đổi trả" key="5">
                        <List
                            size="small"
                            dataSource={[
                                'Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng',
                                'Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng',
                                'Không áp dụng đổi trả với sản phẩm khuyến mãi đặc biệt',
                                'Khách hàng chịu phí vận chuyển đổi trả (nếu có)'
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>
                </Collapse>

                <Divider />

                <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text strong>Mọi thắc mắc vui lòng liên hệ:</Text> hotline 1900 1234 hoặc email support@cuahang.com
                </Paragraph>

                <Paragraph style={{ textAlign: 'center', fontStyle: 'italic' }}>
                    Chính sách có hiệu lực từ ngày 01/01/2025 và có thể thay đổi theo quy định của cửa hàng.
                </Paragraph>
            </Card>
        </div>
    );
};

export default Policy;