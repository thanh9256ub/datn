import React, { useState, useEffect } from 'react';
import { 
  Button, Card, Form, Input, List, Typography, Spin, 
  Alert, Divider, Space, Tag, Image, Row, Col, Descriptions 
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchOrderByCode, fetchOrderDetailsByOrderId } from '../Service/productService';

const { Title, Text } = Typography;

export const SearchOrder = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);

  const onSearch = async (values) => {
    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      setOrderDetails([]);
      
      // 1. Tìm order bằng orderCode
      const orderData = await fetchOrderByCode(values.orderCode);
      setOrder(orderData);
      
      // 2. Nếu tìm thấy order, lấy danh sách orderDetails
      if (orderData && orderData.id) {
        const details = await fetchOrderDetailsByOrderId(orderData.id);
        setOrderDetails(details);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Không tìm thấy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      1: { color: 'orange', text: 'Chờ xác nhận' },
      2: { color: 'blue', text: 'Đã xác nhận' },
      3: { color: 'cyan', text: 'Đang giao hàng' },
      4: { color: 'green', text: 'Đã giao hàng' },
      5: { color: 'red', text: 'Đã hủy' },
    };
    return <Tag color={statusMap[status]?.color || 'gray'}>
      {statusMap[status]?.text || 'Không xác định'}
    </Tag>;
  };

  const renderProductList = () => {
    if (loading) {
      return <Spin tip="Đang tải sản phẩm..." style={{ padding: '24px 0' }} />;
    }

    if (!orderDetails || orderDetails.length === 0) {
      return <Alert message="Không có sản phẩm nào trong đơn hàng này" type="info" />;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={orderDetails}
        renderItem={(item, index) => {
          // Xử lý dữ liệu sản phẩm
          const productName = item.productDetail?.product?.productName || 
                            item.productDetailName || 
                            `Sản phẩm ${index + 1}`;
          const color = item.productDetail?.color?.colorName || 'Không xác định';
          const size = item.productDetail?.size?.sizeName || 'Không xác định';
          const imageUrl = item.productDetail?.product?.mainImage || 
                         'https://via.placeholder.com/80';

          return (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <Image
                    src={imageUrl}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                    fallback="https://via.placeholder.com/80"
                  />
                }
                title={<Text strong>{productName}</Text>}
                description={
                  <Space direction="vertical" size="small">
                    <div>
                      <Text>Màu: {color}</Text>
                      <Text style={{ marginLeft: 8 }}>Size: {size}</Text>
                    </div>
                    <div>
                      <Text>Giá: {(item.price || 0).toLocaleString('vi-VN')}₫</Text>
                      <Text style={{ marginLeft: 8 }}>Số lượng: {item.quantity}</Text>
                    </div>
                    <Text strong>Thành tiền: {(item.totalPrice || item.price * item.quantity).toLocaleString('vi-VN')}₫</Text>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Tra cứu đơn hàng</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item
            name="orderCode"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
            style={{ flex: 1 }}
          >
            <Input 
              placeholder="Nhập mã đơn hàng (ví dụ: HD2407123456)" 
              size="large" 
              style={{ minWidth: 300 }}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />} 
              size="large"
              loading={loading}
            >
              Tra cứu
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && !order && (
        <Spin tip="Đang tìm kiếm đơn hàng..." size="large" style={{ width: '100%', padding: 40 }} />
      )}

      {error && (
        <Alert 
          message="Lỗi khi tìm đơn hàng" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: 24 }} 
        />
      )}

      {order && (
        <>
          <Card 
            title={`Đơn hàng #${order.orderCode}`}
            extra={getStatusTag(order.status)}
            style={{ marginBottom: 24 }}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Khách hàng">{order.customerName || 'Khách vãng lai'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{order.phone || 'Chưa cung cấp'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{order.address || 'Chưa cung cấp'}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt hàng">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Không rõ'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {order.note || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Thông tin thanh toán</Divider>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Phương thức thanh toán:</Text> {order.paymentMethod?.methodName || 'COD'}
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Tổng tiền hàng:</Text> {order.totalPrice?.toLocaleString('vi-VN')}₫
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Phí vận chuyển:</Text> {order.shippingFee?.toLocaleString('vi-VN')}₫
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Tổng thanh toán:</Text> 
                <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                  {' '}{order.totalPayment?.toLocaleString('vi-VN')}₫
                </Text>
              </Col>
            </Row>
          </Card>

          <Card title="Danh sách sản phẩm">
            {renderProductList()}
          </Card>
        </>
      )}
    </div>
  );
};