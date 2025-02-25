import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Table, Badge, Card, Button } from 'react-bootstrap';

export const OrderDetail = () => {
    const { orderId } = useParams();
    const { state } = useLocation();
    const order = state?.order;

    if (!order) {
        return (
            <Container className="mt-5 text-center">
                <h4 className="text-muted fw-light">Không có dữ liệu đơn hàng.</h4>
            </Container>
        );
    }

    const customerInfo = {
        email: "example@email.com",
        phone: "0123 456 789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
    };

    const items = [
        { product: "Sản phẩm 1", quantity: 2, price: "60,000 VNĐ", total: "120,000 VNĐ" },
        { product: "Sản phẩm 2", quantity: 1, price: "50,000 VNĐ", total: "50,000 VNĐ" },
    ];

    const shippingFee = 30000;
    const subtotal = items.reduce((acc, item) => acc + parseInt(item.total.replace(/[^0-9]/g, '')), 0);
    const total = subtotal + shippingFee;

    const handlePrint = () => {
        const printContent = document.getElementById('invoice');
        const newWindow = window.open('', '', 'height=800,width=600');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Hóa Đơn #${order?.id}</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; padding: 30px; color: #333; }
                        h1 { font-size: 28px; color: #2b6cb0; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; }
                        h2 { font-size: 22px; color: #2d3748; margin-top: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; }
                        th { background-color: #f7fafc; color: #4a5568; font-weight: 600; }
                        td { color: #718096; }
                        .total { font-weight: bold; font-size: 18px; color: #2b6cb0; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        newWindow.document.close();
        newWindow.print();
    };

    return (
        <Container className="my-5" style={{ maxWidth: '1000px', fontFamily: "'Segoe UI', sans-serif" }}>
            <h2 className="mb-5 text-center text-primary fw-bold" style={{ color: '#2b6cb0' }}>
                Chi tiết đơn hàng #{order?.orderCode}
            </h2>

            <Row className="g-4">
                {/* Thông tin đơn hàng */}
                <Col xs={12}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #f7fafc, #edf2f7)' }}>
                            <Card.Title className="fw-semibold mb-4" style={{ color: '#2d3748', fontSize: '1.5rem' }}>
                                Thông tin đơn hàng
                            </Card.Title>
                            <p className="mb-2" style={{ color: '#4a5568' }}><strong>Khách hàng:</strong> {order?.customer}</p>
                            <p className="mb-2" style={{ color: '#4a5568' }}><strong>Ngày đặt:</strong> {order?.orderDate}</p>
                            <p className="mb-0">
                                <strong style={{ color: '#4a5568' }}>Trạng thái:</strong>{' '}
                                <Badge
                                    bg={
                                        order?.status === "Đang vận chuyển"
                                            ? "warning"
                                            : order?.status === "Hoàn thành"
                                                ? "success"
                                                : "danger"
                                    }
                                    className="px-2 py-1 text black"
                                    style={{ fontSize: '0.9rem', fontWeight: '500' }}
                                >
                                    {order?.status}
                                </Badge>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Thông tin khách hàng */}
                <Col xs={12}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #f7fafc, #edf2f7)' }}>
                            <Card.Title className="fw-semibold mb-4" style={{ color: '#2d3748', fontSize: '1.5rem' }}>
                                Thông tin khách hàng
                            </Card.Title>
                            <p className="mb-2" style={{ color: '#4a5568' }}><strong>Email:</strong> {customerInfo.email}</p>
                            <p className="mb-2" style={{ color: '#4a5568' }}><strong>SĐT:</strong> {customerInfo.phone}</p>
                            <p className="mb-0" style={{ color: '#4a5568' }}><strong>Địa chỉ:</strong> {customerInfo.address}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sản phẩm đã đặt */}
                <Col xs={12}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <Card.Body className="p-4">
                            <Card.Title className="fw-semibold mb-4" style={{ color: '#2d3748', fontSize: '1.5rem' }}>
                                Sản phẩm đã đặt
                            </Card.Title>
                            <Table bordered hover responsive className="mb-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <thead style={{ backgroundColor: '#f7fafc', color: '#4a5568' }}>
                                    <tr>
                                        <th className="text-center py-3">Sản phẩm</th>
                                        <th className="text-center py-3">Số lượng</th>
                                        <th className="text-center py-3">Đơn giá</th>
                                        <th className="text-center py-3">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody style={{ color: '#718096' }}>
                                    {items.map((item, index) => (
                                        <tr key={index} className="transition-all hover:bg-gray-50">
                                            <td className="py-3">{item.product}</td>
                                            <td className="text-center py-3">{item.quantity}</td>
                                            <td className="text-end py-3">{item.price}</td>
                                            <td className="text-end py-3">{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Tổng kết đơn hàng */}
                <Col xs={12}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #f7fafc, #edf2f7)' }}>
                            <Card.Title className="fw-semibold mb-4" style={{ color: '#2d3748', fontSize: '1.5rem' }}>
                                Tổng kết
                            </Card.Title>
                            <div className="d-flex justify-content-between mb-3" style={{ color: '#4a5568' }}>
                                <span>Tạm tính:</span>
                                <span>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3" style={{ color: '#4a5568' }}>
                                <span>Phí vận chuyển:</span>
                                <span>{shippingFee.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <hr style={{ borderColor: '#e2e8f0' }} />
                            <div className="d-flex justify-content-between fw-bold" style={{ color: '#2b6cb0', fontSize: '1.25rem' }}>
                                <span>Tổng cộng:</span>
                                <span>{total.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Nút in hóa đơn */}
            <Row className="mt-5">
                <Col className="text-center">
                    {/* <Button
                        variant="primary"
                        size="lg"
                        
                        className="px-5 py-2 shadow-sm transition-all hover:shadow-md"
                        style={{
                            background: 'linear-gradient(90deg, #2b6cb0, #4299e1)',
                            border: 'none',
                            borderRadius: '25px',
                            fontWeight: '500',
                        }}
                    >
                       
                    </Button> */}
                    <button type="button" className="btn btn-gradient-info btn-icon-text" onClick={handlePrint}>
                        Print
                        <i className="mdi mdi-printer btn-icon-append"> </i>
                    </button>
                </Col>
            </Row>

            {/* Phần in hóa đơn */}
            <div id="invoice" style={{ display: 'none' }}>
                <h1>Hóa đơn #{order?.id}</h1>
                <p><strong>Khách hàng:</strong> {order?.customer}</p>
                <p><strong>Ngày đặt:</strong> {order?.orderDate}</p>
                <p><strong>Trạng thái:</strong> {order?.status}</p>

                <h2>Sản phẩm đã đặt</h2>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <h3>Tổng kết</h3>
                <p><strong>Tạm tính:</strong> {subtotal.toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Phí vận chuyển:</strong> {shippingFee.toLocaleString('vi-VN')} VNĐ</p>
                <p className="total"><strong>Tổng cộng:</strong> {total.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        </Container>
    );
};

export default OrderDetail;