import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const OrderDetail = () => {
    const location = useLocation();
    const order = location.state?.order; // Lấy dữ liệu order từ state

    // Kiểm tra xem order có tồn tại không
    if (!order) {
        return (
            <div className="container mt-5">
                <h3>Không tìm thấy thông tin đơn hàng</h3>
            </div>
        );
    }

    console.log('Order:', order);
    console.log('Order Details:', order.productDetail); // Debugging to check the orderDetails

    return (
        <div className="container-fluid py-3">
            <Card className="shadow">
                {/* Header */}
                <Card.Header className="bg-white border-bottom-0 d-flex align-items-center">
                    <Button
                        variant="link"
                        onClick={() => window.history.back()}
                        className="me-3"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </Button>
                    <h2 className="mb-0">Chi tiết đơn hàng #{order.orderCode}</h2>
                </Card.Header>

                <Card.Body>
                    {/* Thông tin khách hàng và đơn hàng */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5>Thông tin khách hàng</h5>
                            <p><strong>Tên:</strong> {order.customerName}</p>
                            <p><strong>Số điện thoại:</strong> {order.phone}</p>
                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                            <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Thông tin đơn hàng</h5>
                            <p><strong>Mã đơn:</strong> {order.orderCode}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod.paymentMethodName}</p>
                            <p><strong>Loại thanh toán:</strong> {order.paymentType.paymentTypeName}</p>
                            <p><strong>Ghi chú:</strong> {order.note || 'Không có'}</p>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <h5>Danh sách sản phẩm</h5>
                    {order.orderDetails && order.orderDetails.length > 0 ? (
                        <Table responsive bordered hover>
                            <thead className="bg-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Màu</th>
                                    <th>Kích thước</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.productDetail.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.product.productName}</td>
                                        <td>{item.color.colorName}</td>
                                        <td>{item.size.sizeName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price.toLocaleString()} VNĐ</td>
                                        <td>{item.totalPrice.toLocaleString()} VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Không có sản phẩm trong đơn hàng này.</p>
                    )}

                    {/* Tổng tiền */}
                    <div className="row justify-content-end">
                        <div className="col-md-4">
                            <div className="border p-3">
                                <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} VNĐ</p>
                                <p><strong>Giảm giá:</strong> {order.discountValue.toLocaleString()} VNĐ</p>
                                <p><strong>Tổng tiền hàng:</strong> {order.totalPrice.toLocaleString()} VNĐ</p>
                                <h5><strong>Tổng thanh toán:</strong> {order.totalPayment.toLocaleString()} VNĐ</h5>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default OrderDetail;