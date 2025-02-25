import React from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Row, Col, Table, Badge, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
export const OrderDetail = (props) => {
    const { state } = useLocation()
    const order = state?.order

    // Dữ liệu mẫu
    const customerInfo = {
        email: "example@email.com",
        phone: "0123 456 789",
        address: "123 Đường ABC, Quận 1, TP.HCM"
    }

    const items = [
        { product: "Sản phẩm 1", quantity: 2, price: "60,000VNĐ", total: "120,000VNĐ" },
        { product: "Sản phẩm 2", quantity: 1, price: "50,000VNĐ", total: "50,000VNĐ" }
    ]

    // Hàm để in hóa đơn
    const handlePrint = () => {
        const printContent = document.getElementById('invoice');
        const newWindow = window.open('', '', 'height=800,width=600');
        newWindow.document.write('<html><head><title>In Hóa Đơn</title></head><body>');
        newWindow.document.write(printContent.innerHTML);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.print();
    }
    const { orderId } = useParams();
    return (
        <Container className="mt-5 w-100" style={{ backgroundColor: '#fff' }}>
            <h1 className="text-center mb-4 text-primary">Chi tiết đơn hàng #{orderId}</h1>

            <Row className="mb-4">
                {/* Thông tin đơn hàng */}
                <Col md={12}>
                    <Card className="shadow-sm p-4 rounded" style={{ background: 'linear-gradient(to right, #f0f4f8, #cce7ff)' }}>
                        <h2 className="text-dark">Thông tin đơn hàng</h2>
                        <p><strong>Khách hàng:</strong> {order?.customer}</p> {/* Sử dụng order từ state */}
                        <p><strong>Ngày đặt:</strong> {order?.orderDate}</p> {/* Sử dụng order từ state */}
                        <p><strong>Trạng thái:</strong>
                            <Badge bg={order?.status === "Đang vận chuyển" ? "warning" :
                                      order?.status === "Hoàn thành" ? "success" : "danger"}>
                                {order?.status} {/* Sử dụng order từ state */}
                            </Badge>
                        </p>
                    </Card>
                </Col>
            </Row>


            <Row className="mb-4">
                {/* Thông tin khách hàng */}
                <Col md={12}>
                    <Card className="shadow-sm p-4 rounded" style={{ background: 'linear-gradient(to right, #e3f2fd, #f0f4f8)' }}>
                        <h2 className="text-dark">Thông tin khách hàng</h2>
                        <p><strong>Email:</strong> {customerInfo.email}</p>
                        <p><strong>SĐT:</strong> {customerInfo.phone}</p>
                        <p><strong>Địa chỉ:</strong> {customerInfo.address}</p>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                {/* Sản phẩm đã đặt */}
                <Col md={12}>
                    <Card className="shadow-sm p-4 rounded" style={{ background: '#ffffff' }}>
                        <h2 className="text-dark">Sản phẩm đã đặt</h2>
                        <Table bordered hover responsive>
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
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                {/* Tổng kết đơn hàng */}
                <Col md={12}>
                    <Card className="shadow-sm p-4 rounded" style={{ background: 'linear-gradient(to right, #f0f4f8, #cce7ff)' }}>
                        <h2 className="text-dark">Tổng kết</h2>
                        <div className="d-flex justify-content-between mb-3">
                            <span><strong>Tạm tính:</strong></span>
                            <span>{order?.total}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span><strong>Phí vận chuyển:</strong></span>
                            <span>30,000VNĐ</span>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <strong><h4>Tổng cộng:</h4></strong>
                            <strong><h4>150,000VNĐ</h4></strong>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Nút in hóa đơn */}
            <Row className="mt-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handlePrint}>In hóa đơn</Button>
                </Col>
            </Row>

            {/* Phần in hóa đơn */}
            <div id="invoice" style={{ display: 'none' }}>
                <h1>Hóa đơn # {order?.id}</h1>
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
                <p><strong>Tạm tính:</strong> {order?.total}</p>
                <p><strong>Số tiền giảm:</strong> 0Đ</p>
                <p><strong>Phí vận chuyển:</strong> 30,000VNĐ</p>
                <p><strong>Tổng cộng:</strong> 150,000VNĐ</p>
            </div>
        </Container>
    )
}

export default OrderDetail;
