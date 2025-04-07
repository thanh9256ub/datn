import React, { useEffect, useState } from 'react';
import { useLocation, useParams,useHistory } from 'react-router-dom';
import { Card, Table, Button, Row, Col, Toast, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faBoxOpen, faTruck, faHome, faCheckCircle, faTimesCircle, faPrint, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchOrderDetailsByOrderId, updateOrderStatus, updateCustomerInfo, updateOrderDetails } from '../OrderService/orderService';
import { Image } from 'react-bootstrap';
import CustomerInfo from './CustomerInfo';
import axios from 'axios';

const OrderDetail = () => {
    const location = useLocation();
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [order, setOrder] = useState(location.state?.order);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [updatedCart, setUpdatedCart] = useState([]);
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [currentProductPage, setCurrentProductPage] = useState(1);
    const [productsPerPage] = useState(5);

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
                        console.log('Order Status:', response[0].order.status);
                        setOrder(response[0].order);
                        setOrderDetails(validOrderDetails);
                        setUpdatedCart(validOrderDetails);
                    } else if (!Array.isArray(response) && response.order) {
                        const validOrderDetails = (response.orderDetails || []).filter(item => item && item.price != null && item.totalPrice != null);
                        console.log('Order Status:', response.order.status);
                        setOrder(response.order);
                        setOrderDetails(validOrderDetails);
                        setUpdatedCart(validOrderDetails);
                    } else {
                        setOrderDetails([]);
                        setUpdatedCart([]);
                    }
                } else {
                    setOrderDetails([]);
                    setUpdatedCart([]);
                }
            } catch (error) {
                if (!isMounted) return;
                setOrderDetails([]);
                setUpdatedCart([]);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/product-detail');
                const products = response.data.data.filter(product => product.quantity > 0 && product.status === 1);
                setAvailableProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        getOrderDetails();
        fetchProducts();
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
        return order.status < 4;
    };

    const handleCustomerUpdate = async (updatedCustomer) => {
        if (!canUpdateOrder()) {
            showNotification("Không thể cập nhật thông tin khi đơn hàng đang giao hàng hoặc đã hoàn tất!");
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
            const statusFlow = [
                { id: 1, name: "Chờ tiếp nhận" },
                { id: 2, name: "Đã tiếp nhận" },
                { id: 5, name: "Hoàn tất" },
            ];
            const currentIndex = statusFlow.findIndex(s => s.id === currentStatus);
            return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1].id : currentStatus;
        } else {
            const statusFlow = [
                { id: 1, name: "Chờ tiếp nhận" },
                { id: 2, name: "Đã xác nhận" },
                { id: 3, name: "Chờ vận chuyển" },
                { id: 4, name: "Đang vận chuyển" },
                { id: 5, name: "Hoàn tất" },
            ];
            const currentIndex = statusFlow.findIndex(s => s.id === currentStatus);
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

            const updatedDetails = await fetchOrderDetailsByOrderId(orderId);
            setOrderDetails(updatedDetails);
            setOrder(updatedDetails[0]?.order);

            showNotification("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error('Error in handleConfirm:', error.response?.data || error.message);
            showNotification(`Có lỗi xảy ra khi cập nhật trạng thái: ${error.response?.data?.data || error.message}`);
        }
    };

    const handleCancelOrder = async () => {
        if (!canCancelOrder()) {
            showNotification("Không thể hủy đơn hàng khi đang vận chuyển hoặc đã hoàn tất!");
            setShowCancelModal(false);
            return;
        }

        try {
            const updateResponse = await updateOrderStatus(order.id, 6);
            console.log('Cancel Response:', updateResponse);

            const updatedDetails = await fetchOrderDetailsByOrderId(orderId);
            setOrderDetails(updatedDetails);
            setOrder(updatedDetails[0]?.order);

            showNotification("Đơn hàng đã được hủy thành công!");
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error in handleCancelOrder:', error.response?.data || error.message);
            showNotification(`Có lỗi xảy ra khi hủy đơn hàng: ${error.response?.data?.data || error.message}`);
        }
    };

    const handleUpdateProductList = () => {
        if (!canUpdateOrder()) {
            showNotification("Không thể cập nhật danh sách sản phẩm khi đơn hàng đang giao hàng hoặc đã hoàn tất!");
            return;
        }
        setShowUpdateModal(true);
    };

    const handleRemoveItem = (orderDetailId) => {
        setUpdatedCart(prev => prev.filter(item => item.id !== orderDetailId));
    };

    const handleSelectProduct = (product) => {
        const existingItem = updatedCart.find(item => item.productDetail.id === product.id);
        if (existingItem) {
            if (product.quantity < existingItem.quantity + 1) {
                showNotification("Số lượng tồn kho không đủ!");
                return;
            }
            setUpdatedCart(prev => prev.map(item =>
                item.productDetail.id === product.id
                    ? { ...item, quantity: item.quantity + 1, totalPrice: item.price * (item.quantity + 1) }
                    : item
            ));
        } else {
            if (product.quantity < 1) {
                showNotification("Số lượng tồn kho không đủ!");
                return;
            }
            const newItem = {
                id: `temp-${Date.now()}`,
                productDetail: product,
                quantity: 1,
                price: product.price,
                totalPrice: product.price,
                status: 0,
                productStatus: 1
            };
            setUpdatedCart(prev => [...prev, newItem]);
        }
    };

    const handleSaveUpdate = async () => {
        if (!canUpdateOrder()) {
            showNotification("Không thể cập nhật danh sách sản phẩm khi đơn hàng đang giao hàng hoặc đã hoàn tất!");
            setShowUpdateModal(false);
            return;
        }
        try {
            const itemsToUpdate = updatedCart.map(item => ({
                orderId: parseInt(orderId),
                productDetailId: item.productDetail.id,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
                status: item.status || 0,
                productStatus: item.productStatus || 1
            }));

            const updatedDetails = await updateOrderDetails(orderId, itemsToUpdate);
            setOrderDetails(updatedDetails);
            setUpdatedCart(updatedDetails);
            setShowUpdateModal(false);
            showNotification("Cập nhật danh sách sản phẩm thành công!");
            history.replace(location.pathname, { ...location.state, shouldRefresh: true });
        } catch (error) {
            showNotification("Lỗi khi cập nhật danh sách sản phẩm: " + error.message);
        }
    };

    const filteredProducts = availableProducts.filter(product => {
        const price = product.price || 0;
        return (
            product.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedColor ? product.color.colorName === selectedColor : true) &&
            (selectedSize ? product.size.sizeName === selectedSize : true) &&
            (minPrice ? price >= parseFloat(minPrice) : true) &&
            (maxPrice ? price <= parseFloat(maxPrice) : true)
        );
    });

    const indexOfLastProduct = currentProductPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginateProduct = (pageNumber) => setCurrentProductPage(pageNumber);

    const handlePrintInvoice = () => {
        // Use orderDetails from state instead of undefined orderDetail
        const selectedOrderDetail = orderDetails; // Already filtered by orderId in useEffect
        const totalAmount = selectedOrderDetail.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const finalAmount = totalAmount - (order.discountValue || 0); // Include discount if available
        const shippingFee = order.shippingFee || 0;

        const invoiceContent = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        margin: 20px;
                    }
                    .invoice-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .invoice-header h2 {
                        font-size: 18px;
                        margin: 5px 0;
                    }
                    .invoice-details {
                        margin-bottom: 20px;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .invoice-table th, .invoice-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    .invoice-table th {
                        background-color: #f2f2f2;
                    }
                    .invoice-footer {
                        margin-top: 20px;
                        text-align: right;
                    }
                    .thank-you {
                        text-align: center;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <h2>HÓA ĐƠN BÁN HÀNG</h2>
                    <p>Mã hóa đơn: ${order.orderCode || 'N/A'}</p>
                    <p>Ngày tạo: ${order.createdAt
                ? new Date(order.createdAt).toLocaleString('vi-VN')
                : 'N/A'}</p>
                    <p>Địa chỉ: Nam Từ Liêm, Hà Nội | Điện thoại: 0123456789</p>
                </div>
                <div class="invoice-details">
                    <p><strong>Tên khách hàng:</strong> ${order.customerName || 'Khách lẻ'}</p>
                    <p><strong>Số điện thoại:</strong> ${order.phone || 'N/A'}</p>
                    <p><strong>Tên nhân viên:</strong> Hoàng Văn Tuấn</p>
                </div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${selectedOrderDetail.length > 0
                ? selectedOrderDetail
                    .filter(item => item.quantity > 0)
                    .map(item => `
                                    <tr>
                                        <td>${item.productDetail?.product?.productName || 'N/A'} - 
                                            ${item.productDetail?.color?.colorName || ''} - 
                                            ${item.productDetail?.size?.sizeName || ''}</td>
                                        <td>${item.quantity || 0}</td>
                                        <td>${(item.price || 0).toLocaleString()} VNĐ</td>
                                        <td>${((item.quantity || 0) * (item.price || 0)).toLocaleString()} VNĐ</td>
                                    </tr>
                                `).join('')
                : '<tr><td colspan="4" style="text-align: center;">Không có sản phẩm</td></tr>'
            }
                    </tbody>
                </table>
                <div class="invoice-footer">
                    <p>Tổng tiền hàng: ${totalAmount.toLocaleString()} VNĐ</p>
                    <p>Giảm giá: ${(order.discountValue || 0).toLocaleString()} VNĐ</p>
                    <p>Phí vận chuyển: ${shippingFee.toLocaleString()} VNĐ</p>
                    <p><strong>Tổng thanh toán: ${(finalAmount + shippingFee).toLocaleString()} VNĐ</strong></p>
                </div>
                <div class="thank-you">
                    Cảm ơn Quý Khách, hẹn gặp lại!
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
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã tiếp nhận", icon: faCheckCircle, color: "#118ab2" },
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        } else {
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", icon: faBoxOpen, color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        }

        let visibleStatuses = [];
        if (status === 6) {
            // Nếu trạng thái là "Đã hủy", chỉ hiển thị trạng thái trước đó và "Đã hủy"
            const lastStatusBeforeCancel = order.statusHistory && order.statusHistory.length > 1
                ? order.statusHistory[order.statusHistory.length - 2] // Lấy trạng thái trước khi hủy
                : statusFlow[0]; // Nếu không có lịch sử, mặc định là trạng thái đầu tiên
            const currentIndex = statusFlow.findIndex(s => s.id === lastStatusBeforeCancel.id) || 0;
            visibleStatuses = [
                statusFlow[currentIndex], // Trạng thái trước khi hủy
                statusFlow.find(s => s.id === 6) // Trạng thái "Đã hủy"
            ];
        } else {
            // Logic hiện tại cho các trạng thái khác
            const currentIndex = statusFlow.findIndex(s => s.id === status);
            visibleStatuses = statusFlow.slice(0, currentIndex + 1);
        }

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
            return order.status === 1;
        } else {
            return order.status < 4;
        }
    };

    const getStatusName = (statusId, orderType) => {
        let statusFlow;

        if (orderType === 0) {
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã tiếp nhận", color: "#118ab2" },
                { id: 5, name: "Hoàn tất", color: "#4caf50" },
                { id: 6, name: "Đã hủy", color: "#ef476f" },
            ];
        } else {
            statusFlow = [
                { id: 1, name: "Chờ tiếp nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", color: "#118ab2" },
                { id: 5, name: "Hoàn tất", color: "#4caf50" },
                { id: 6, name: "Đã hủy", color: "#ef476f" },
            ];
        }

        const status = statusFlow.find(s => s.id === statusId);
        return status ? { name: status.name, color: status.color } : { name: "Không xác định", color: "#6c757d" };
    };

    const getPaymentStatusName = (paymentStatus) => {
        return paymentStatus === 1 ? { name: "Đã thanh toán", color: "#4caf50" } : { name: "Chưa thanh toán", color: "#ef476f" };
    };

    const calculateProductsTotal = () => {
        return orderDetails.reduce((total, item) => total + item.totalPrice, 0);
    };

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
                            <div className="d-flex justify-content-between mt-3">
                                <div className="d-flex gap-2">
                                    {order.status !== 5 && order.status !== 6 && (
                                        <Button variant="primary" onClick={handleConfirm}>
                                            Xác nhận
                                        </Button>
                                    )}
                                    {canCancelOrder() && (
                                        <Button
                                            variant="danger"
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                            Hủy đơn hàng
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    variant="success"
                                    onClick={handlePrintInvoice}
                                >
                                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                                    In hóa đơn
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
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
                        canUpdate={canUpdateOrder()}
                    />
                </Col>

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
                                <span className="badge" style={{ backgroundColor: getOrderTypeName(order.orderType).color, color: '#fff' }}>
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
                                disabled={!canUpdateOrder()}
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
                                                            onError={(e) => { e.target.src = '/default-product.png'; }}
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

            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="xl" centered dialogClassName="large-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật danh sách sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Giỏ hàng hiện tại</h5>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Tổng</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {updatedCart.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.productDetail?.product?.productName} - {item.productDetail?.color?.colorName} - {item.productDetail?.size?.sizeName}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.totalPrice.toLocaleString()} VNĐ</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col md={6}>
                            <h5>Danh sách sản phẩm</h5>
                            <Form className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="searchTerm">
                                            <Form.Label>Tìm kiếm</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tìm kiếm sản phẩm"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="colorFilter">
                                            <Form.Label>Màu sắc</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedColor}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                            >
                                                <option value="">Tất cả màu sắc</option>
                                                {[...new Set(availableProducts.map(product => product.color.colorName))].map(color => (
                                                    <option key={color} value={color}>{color}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group controlId="sizeFilter">
                                            <Form.Label>Kích thước</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedSize}
                                                onChange={(e) => setSelectedSize(e.target.value)}
                                            >
                                                <option value="">Tất cả kích thước</option>
                                                {[...new Set(availableProducts.map(product => product.size.sizeName))].map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="minPrice">
                                            <Form.Label>Giá tối thiểu</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Giá min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="maxPrice">
                                            <Form.Label>Giá tối đa</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Giá max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map(product => (
                                            <tr key={product.id} onClick={() => handleSelectProduct(product)} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    <img
                                                        src={product.product.mainImage || '/default-product.png'}
                                                        alt={product.product.productName}
                                                        style={{ width: '50px', height: 'auto' }}
                                                    />
                                                </td>
                                                <td>{product.product.productName} - {product.color.colorName} - {product.size.sizeName}</td>
                                                <td>{product.price.toLocaleString()} VNĐ</td>
                                                <td>{product.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination
                                itemsPerPage={productsPerPage}
                                totalItems={filteredProducts.length}
                                paginate={paginateProduct}
                                currentPage={currentProductPage}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdate}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn hủy đơn hàng #{order.orderCode} không? Hành động này không thể hoàn tác.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Hủy bỏ
                    </Button>
                    <Button variant="danger" onClick={handleCancelOrder}>
                        Xác nhận hủy
                    </Button>
                </Modal.Footer>
            </Modal>

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

                .large-modal {
                    max-width: 90%;
                    width: 90%;
                }
            `}</style>
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default OrderDetail;