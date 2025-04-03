import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Table, Button, Row, Col, Toast, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faBoxOpen, faTruck, faHome, faCheckCircle, faTimesCircle, faPrint, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchOrderDetailsByOrderId, updateOrderStatus, updateCustomerInfo } from '../OrderService/orderService';
import { Image } from 'react-bootstrap';
import CustomerInfo from './CustomerInfo';
const OrderDetail = () => {
    const location = useLocation();
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [order, setOrder] = useState(location.state?.order);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getOrderDetails = async () => {
            try {
                const response = await fetchOrderDetailsByOrderId(orderId);
                console.log('Raw API Response:', response);

                if (!isMounted) return;

                if (response) {
                    if (Array.isArray(response) && response.length > 0) {
                        const validOrderDetails = response.filter(item => item && item.price != null && item.totalPrice != null);
                        console.log('Order Status:', response[0].order.status); // Kiểm tra status
                        setOrder(response[0].order);
                        setOrderDetails(validOrderDetails);
                    } else if (!Array.isArray(response) && response.order) {
                        const validOrderDetails = (response.orderDetails || []).filter(item => item && item.price != null && item.totalPrice != null);
                        console.log('Order Status:', response.order.status); // Kiểm tra status
                        setOrder(response.order);
                        setOrderDetails(validOrderDetails);
                    } else {
                        setOrderDetails([]);
                    }
                } else {
                    setOrderDetails([]);
                }
            } catch (error) {
                if (!isMounted) return;
                setOrderDetails([]);
            }
        };

        getOrderDetails();
        return () => { isMounted = false; };
    }, [orderId]);

    if (!order) {
        return (
            <div className="container mt-5 text-center bg-white">
                <h3 className="text-muted">Không tìm thấy thông tin đơn hàng</h3>
            </div>
        );
    }
    const canUpdateOrder = () => {
        return order.status !== 4;
    };
    const handleCustomerUpdate = async (updatedCustomer) => {
        if (!canUpdateOrder()) {
            showNotification("Không thể cập nhật thông tin khi đơn hàng đang giao hàng!");
            return;
        }
        let isMounted = true;
        try {
            const response = await updateCustomerInfo(orderId, {
                customerName: updatedCustomer.customerName,
                phone: updatedCustomer.phone,
                address: updatedCustomer.address
            });
            if (!isMounted) return;

            setOrder(prev => ({
                ...prev,
                customerName: updatedCustomer.customerName,
                phone: updatedCustomer.phone,
                address: updatedCustomer.address
            }));
            setOrderDetails(prev => prev.map(item => ({
                ...item,
                order: {
                    ...item.order,
                    customerName: updatedCustomer.customerName,
                    phone: updatedCustomer.phone,
                    address: updatedCustomer.address
                }
            })));
            showNotification("Cập nhật thông tin thành công!");
            return response;
        } catch (error) {
            if (!isMounted) return;
            console.error('Update failed:', {
                error: error.response?.data || error.message,
                request: { orderId, updatedCustomer }
            });
            showNotification(`Lỗi cập nhật: ${error.message}`);
            throw error;
        } finally {
            isMounted = false;
        }
    };

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const isCounterOrderWithCashPayment = () => {
        return order.orderType === 0 && order.paymentType.paymentTypeName === "Trực tiếp";
    };

    const getNextStatus = (currentStatus) => {
        if (isCounterOrderWithCashPayment()) {
            // Đơn tại quầy thanh toán trực tiếp - 3 trạng thái
            const statusFlow = [
                { id: 1, name: "Chờ tiếp nhận" },
                { id: 2, name: "Đã tiếp nhận" },
                { id: 3, name: "Hoàn tất" },
            ];
            const currentIndex = statusFlow.findIndex(s => s.id === currentStatus);
            // Nếu đã ở trạng thái cuối (Hoàn tất), không chuyển nữa
            return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1].id : currentStatus;
        } else {
            // Các loại đơn khác - 7 trạng thái
            const statusFlow = [
                { id: 1, name: "Chờ tiếp nhận" },
                { id: 2, name: "Đã xác nhận" },
                { id: 3, name: "Chờ vận chuyển" },
                { id: 4, name: "Đang vận chuyển" },
                { id: 5, name: "Hoàn tất" },
                //  { id: 6, name: "Hoàn tất" },
            ];
            const currentIndex = statusFlow.findIndex(s => s.id === currentStatus);
            // Nếu đã ở trạng thái cuối (Hoàn tất), không chuyển nữa
            return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1].id : currentStatus;
        }
    };
    const getOrderTypeName = (orderType) => {
        return orderType === 0
            ? { name: "Tại quầy", color: "#118ab2" }
            : { name: "Đơn online", color: "#4caf50" };
    };
    const handleConfirm = async () => {
        const nextStatus = getNextStatus(order.status);
        if (nextStatus === order.status) {
            showNotification("Đơn hàng đã ở trạng thái cuối cùng.");
            return;
        }

        try {
            const updateResponse = await updateOrderStatus(order.id, nextStatus);
            console.log('Update Response:', updateResponse);

            // Sau khi cập nhật trạng thái, bạn cần lấy lại chi tiết đơn hàng
            const updatedDetails = await fetchOrderDetailsByOrderId(orderId);
            setOrderDetails(updatedDetails);
            setOrder(updatedDetails[0]?.order);  // Cập nhật lại thông tin trạng thái cho order

            showNotification("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error('Error in handleConfirm:', error.response?.data || error.message);
            showNotification(`Có lỗi xảy ra khi cập nhật trạng thái: ${error.response?.data?.data || error.message}`);
        }
    };
    const handleUpdateCustomerInfo = () => {
        showNotification("Đã gửi yêu cầu cập nhật thông tin khách hàng!");
    };

    const handleUpdateProductList = () => {
        showNotification("Đã gửi yêu cầu cập nhật danh sách sản phẩm!");
    };

    const handlePrintInvoice = () => {
        const invoiceContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; font-size: 14px; margin: 20px; }
                        .invoice-header { text-align: center; font-size: 18px; margin-bottom: 20px; }
                        .invoice-details { margin-bottom: 20px; }
                        .invoice-details th, .invoice-details td { padding: 8px; text-align: left; }
                        .invoice-footer { margin-top: 20px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <h2>Hóa đơn đơn hàng: ${order.orderCode}</h2>
                        <p>Ngày đặt hàng: ${new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="invoice-details">
                        <table border="1" width="100%">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderDetails.length > 0 ? orderDetails.map(item => {
            const price = item?.price ?? 0;
            const totalPrice = item?.totalPrice ?? 0;
            return `
                                        <tr>
                                            <td>${item?.productDetail?.product?.productName || 'N/A'}</td>
                                            <td>${item?.quantity || 0}</td>
                                            <td>${price.toLocaleString()} VNĐ</td>
                                            <td>${totalPrice.toLocaleString()} VNĐ</td>
                                        </tr>
                                    `;
        }).join('') : '<tr><td colspan="4">Không có sản phẩm</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    <div class="invoice-footer">
                        <p>Tổng tiền: ${calculateTotalPayment().toLocaleString()} VNĐ</p>
                    </div>
                </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const StatusTimeline = ({ status }) => {
        let statusFlow;

        if (isCounterOrderWithCashPayment()) {
            // Timeline cho đơn tại quầy thanh toán trực tiếp
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã tiếp nhận", icon: faCheckCircle, color: "#118ab2" },
                { id: 3, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        } else {
            // Timeline cho các loại đơn khác
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", icon: faBoxOpen, color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        }

        const currentIndex = statusFlow.findIndex(s => s.id === status);
        const visibleStatuses = statusFlow.slice(0, currentIndex + 1);

        return (
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                {visibleStatuses.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <div className="d-flex flex-column align-items-center" style={{ gap: "5px" }}>
                            <FontAwesomeIcon icon={s.icon} style={{ color: s.color, fontSize: "24px" }} />
                            <span style={{ fontSize: "12px", color: s.color, textAlign: "center" }}>{s.name}</span>
                        </div>
                        {index < visibleStatuses.length - 1 && (
                            <div style={{ width: "20px", height: "2px", backgroundColor: s.color }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const canCancelOrder = () => {
        if (isCounterOrderWithCashPayment()) {
            // Đơn tại quầy thanh toán trực tiếp: chỉ hủy khi chờ tiếp nhận
            return order.status === 1;
        } else {
            // Các đơn khác: hủy trước khi giao hàng
            return order.status < 5;
        }
    };
    const getStatusName = (statusId, orderType) => {
        let statusFlow;

        if (orderType === 0) { // Đơn tại quầy
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã tiếp nhận", color: "#118ab2" },
                { id: 3, name: "Hoàn tất", color: "#4caf50" },
                { id: 6, name: "Đã hủy", color: "#ef476f" }, // Đồng bộ với StatusTimeline
            ];
        } else { // Đơn online
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", color: "#118ab2" },
                { id: 5, name: "Hoàn tất", color: "#4caf50" }, // Đồng bộ với getNextStatus
                { id: 6, name: "Đã hủy", color: "#ef476f" },
            ];
        }

        const status = statusFlow.find(s => s.id === statusId);
        return status ? { name: status.name, color: status.color } : { name: "Không xác định", color: "#6c757d" };
    };

    const getPaymentStatusName = (paymentStatus) => {
        return paymentStatus === 1 ? { name: "Đã thanh toán", color: "#4caf50" } : { name: "Chưa thanh toán", color: "#ef476f" };
    };

    // Tính tổng giá trị sản phẩm từ orderDetails
    const calculateProductsTotal = () => {
        return orderDetails.reduce((total, item) => total + item.totalPrice, 0);
    };

    // Tính tổng thanh toán
    const calculateTotalPayment = () => {
        const productsTotal = calculateProductsTotal();
        return productsTotal + order.shippingFee - order.discountValue;
    };

    const statusInfo = getStatusName(order.status, order.orderType);
    const paymentStatusInfo = getPaymentStatusName(order.paymentStatus);

    return (
        <div className="container-fluid py-4 bg-white min-vh-100">
            <Row className="mb-4">
                <Col>
                    <Button variant="outline-primary" onClick={() => window.history.back()} className="mb-3">
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Quay lại
                    </Button>
                    <h2 className="fw-bold text-primary">Chi tiết đơn hàng #{order.orderCode}</h2>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm bg-white border border-light">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0">Trạng thái đơn hàng</h5>
                        </Card.Header>
                        <Card.Body>
                            <StatusTimeline status={order.status} />
                            <div className="d-flex gap-2 mt-3">
                                {order.status !== 5 && order.status !== 6 && (
                                    <Button variant="primary" onClick={handleConfirm}>
                                        Xác nhận
                                    </Button>
                                )}
                                <Button
                                    variant="success"
                                    onClick={handlePrintInvoice}
                                    className="custom-hover-button"
                                >
                                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                                    In hóa đơn
                                </Button>
                                {canCancelOrder() && (
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowCancelModal(true)}
                                        className="custom-hover-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                                        Hủy đơn hàng
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Thông tin khách hàng */}
                <Col md={6}>
                    <CustomerInfo
                        customer={{
                            customerName: order.customerName,
                            phone: order.phone,
                            address: order.address,
                            customer: order.customer
                        }}
                        onUpdate={handleCustomerUpdate}
                        showNotification={showNotification}
                    />
                </Col>

                {/* Thông tin đơn hàng */}
                <Col md={6}>
                    <Card className="shadow-sm h-100 bg-white border border-light">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0">Thông tin đơn hàng</h5>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Mã đơn:</strong> {order.orderCode}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p>
                                <strong>Loại đơn hàng:</strong>{" "}
                                <span className="badge" style={{
                                    backgroundColor: getOrderTypeName(order.orderType).color,
                                    color: '#fff'
                                }}>
                                    {getOrderTypeName(order.orderType).name}
                                </span>
                            </p>
                            <p><strong>Trạng thái:</strong> <span className="badge" style={{ backgroundColor: statusInfo.color, color: '#fff' }}>{statusInfo.name}</span></p>
                            <p><strong>Loại thanh toán:</strong> <span className="badge bg-info text-white">{order.paymentType?.paymentTypeName || 'Không xác định'}</span></p>
                            <p><strong>Phương thức thanh toán:</strong> <span className="badge bg-info text-white">{order.paymentMethod.paymentMethodName}</span></p>
                            <p><strong>Ghi chú:</strong> {order.note || 'Không có'}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm bg-white border border-light">
                        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Danh sách sản phẩm</h5>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={handleUpdateProductList}
                                className="custom-hover-button"
                            >
                                <FontAwesomeIcon icon={faEdit} className="me-2" />
                                Cập nhật
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {orderDetails.length > 0 ? (
                                <Table responsive bordered hover className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Màu</th>
                                            <th>Kích thước</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.map((item, index) => {
                                            // Xử lý dữ liệu an toàn
                                            const product = item.productDetail?.product || {};
                                            const color = item.productDetail?.color || {};
                                            const size = item.productDetail?.size || {};
                                            const price = item.price || 0;
                                            const quantity = item.quantity || 0;
                                            const totalPrice = item.totalPrice || price * quantity;

                                            return (
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Image
                                                            src={product.mainImage || '/default-product.png'}
                                                            alt={product.productName || 'N/A'}
                                                            thumbnail
                                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                            onError={(e) => {
                                                                e.target.src = '/default-product.png';
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{product.productName || 'N/A'}</td>
                                                    <td>{color.colorName || 'N/A'}</td>
                                                    <td>{size.sizeName || 'N/A'}</td>
                                                    <td>{quantity}</td>
                                                    <td>{price.toLocaleString()} VNĐ</td>
                                                    <td>{totalPrice.toLocaleString()} VNĐ</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center py-5">
                                    <Alert variant="warning">
                                        <h5>Không tìm thấy sản phẩm nào trong đơn hàng</h5>
                                        <p className="mb-3">Mã đơn hàng: #{order?.orderCode || 'N/A'}</p>

                                        <div className="text-start bg-light p-3 rounded">
                                            <h6>Thông tin debug:</h6>
                                            <p><strong>Order ID:</strong> {orderId}</p>
                                            <p><strong>API Endpoint:</strong> /order-detail/order/{orderId}</p>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => console.log('Debug info:', { orderId, order, orderDetails })}
                                            >
                                                Xem thông tin debug
                                            </Button>
                                        </div>
                                    </Alert>

                                    <Button
                                        variant="primary"
                                        className="mt-3"
                                        onClick={() => window.location.reload()}
                                    >
                                        Tải lại trang
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm bg-white border border-light">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0">Tổng thanh toán</h5>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Tổng tiền hàng:</strong> {calculateProductsTotal().toLocaleString()} VNĐ</p>
                            <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} VNĐ</p>
                            <p><strong>Giảm giá:</strong> {order.discountValue.toLocaleString()} VNĐ</p>
                            <h5 className="fw-bold text-danger"><strong>Tổng thanh toán:</strong> {calculateTotalPayment().toLocaleString()} VNĐ</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                className="custom-toast"
                style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, minWidth: '300px' }}
            >
                <Toast.Body className="d-flex align-items-center p-3 position-relative" style={{ gap: '15px' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#4caf50', fontSize: '20px' }} />
                    <span>{toastMessage}</span>
                    <div className="progress-bar" />
                </Toast.Body>
            </Toast>

            <style jsx>{`
                .custom-hover-button:hover {
                    background-color: #6610f2 !important;
                    border-color: #6610f2 !important;
                    color: white !important;
                }

                .custom-toast {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .custom-toast .toast-body {
                    position: relative;
                    font-size: 16px;
                    color: #333;
                }

                .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background-color: #4caf50;
                    animation: progress 3s linear forwards;
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderDetail;