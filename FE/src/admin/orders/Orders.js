import React, { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Pagination, Toast } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import eyeIcon from './icons8-eyes-64.png';
import { fetchOrders, updateOrderStatus } from './OrderService/orderService'; // Import hàm fetchOrders và updateOrderStatus
import trash from './icons8-trash-24.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faBoxOpen,
    faTruck,
    faCheckCircle,
    faTimesCircle,
    faHome,
    faPrint,
} from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
    const [data, setData] = useState([]); // Luôn là mảng
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
    const history = useHistory();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await fetchOrders();
                console.log('Dữ liệu từ API:', response); // Log dữ liệu để kiểm tra

                // Kiểm tra xem response có chứa trường data và data có phải là mảng không
                if (response && response.data && Array.isArray(response.data)) {
                    setData(response.data); // Cập nhật state với mảng data từ API
                } else {
                    console.error('Dữ liệu không hợp lệ:', response);
                    setData([]); // Đặt state thành mảng rỗng nếu dữ liệu không hợp lệ
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setData([]); // Đặt state thành mảng rỗng nếu có lỗi
            }
        };

        getOrders();
    }, []);

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleNavigate = (orderId) => {
        const order = data.find(order => order.id === orderId);
        history.push({
            pathname: `/admin/order-detail/orders/${orderId}`,
            state: { order }
        });
    };

    const handleRowClick = (orderId) => {
        const order = data.find(order => order.id === orderId);
        setSelectedOrder(order);
    };

    const handleConfirm = async () => {
        if (!selectedOrder) return;

        const nextStatus = getNextStatus(selectedOrder.status);
        if (nextStatus === selectedOrder.status) {
            showNotification("Đơn hàng đã ở trạng thái cuối cùng.");
            return;
        }

        try {
            // Gọi API để cập nhật trạng thái
            console.log("Updating order status:", selectedOrder.id, nextStatus);
            await updateOrderStatus(selectedOrder.id, nextStatus);

            // Cập nhật lại state data với trạng thái mới
            const updatedData = data.map(order =>
                order.id === selectedOrder.id ? { ...order, status: nextStatus } : order
            );
            setData(updatedData);

            // Cập nhật selectedOrder với trạng thái mới
            setSelectedOrder(prev => ({ ...prev, status: nextStatus }));

            showNotification("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    };

    const handlePrintInvoice = () => {
        if (!selectedOrder) return;

        const order = selectedOrder;
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
                            font-size: 18px;
                            margin-bottom: 20px;
                        }
                        .invoice-details {
                            margin-bottom: 20px;
                        }
                        .invoice-details th, .invoice-details td {
                            padding: 8px;
                            text-align: left;
                        }
                        .invoice-footer {
                            margin-top: 20px;
                            text-align: center;
                        }
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
                                ${order.cart ? order.cart.map(item => `
                                    <tr>
                                        <td>${item.product}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price}</td>
                                        <td>${(parseInt(item.price.replace('VNĐ', '').trim())) * item.quantity} VNĐ</td>
                                    </tr>
                                `).join('') : 'Không có sản phẩm'}
                            </tbody>
                        </table>
                    </div>
                    <div class="invoice-footer">
                        <p>Tổng tiền: ${order.totalPayment.toLocaleString()} VNĐ</p>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = [
            { id: 1, name: "Chờ tiếp nhận" },
            { id: 2, name: "Chờ lấy hàng" },
            { id: 3, name: "Chờ vận chuyển" },
            { id: 4, name: "Đang vận chuyển" },
            { id: 5, name: "Đã giao" },
            { id: 6, name: "Hoàn tất" },
            { id: 7, name: "Đã hủy" },
        ];

        const currentIndex = statusFlow.findIndex(s => s.id === currentStatus);
        return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1].id : currentStatus;
    };

    const StatusTimeline = ({ status }) => {
        const statusFlow = [
            { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#ff6b6b" },
            { id: 2, name: "Chờ lấy hàng", icon: faBoxOpen, color: "#ffd700" },
            { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#118ab2" },
            { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#118ab2" },
            { id: 5, name: "Đã giao", icon: faHome, color: "#4caf50" },
            { id: 6, name: "Hoàn thành", icon: faCheckCircle, color: "#4caf50" },
            { id: 7, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
        ];

        const currentIndex = statusFlow.findIndex(s => s.id === status);
        const visibleStatuses = statusFlow.slice(0, currentIndex + 1);

        return (
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                {visibleStatuses.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <div className="d-flex flex-column align-items-center" style={{ gap: "5px" }}>
                            <FontAwesomeIcon
                                icon={s.icon}
                                style={{
                                    color: s.color,
                                    fontSize: "24px",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: s.color,
                                    textAlign: "center",
                                }}
                            >
                                {s.name}
                            </span>
                        </div>
                        {index < visibleStatuses.length - 1 && (
                            <div
                                style={{
                                    width: "20px",
                                    height: "2px",
                                    backgroundColor: s.color,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="container-fluid py-3">
            <div className="card shadow">
                <div className="card-header bg-white border-bottom-0">
                    <h2 className="mb-0">Customer's Orders</h2>
                </div>

                {/* Timeline */}
                <div className="card-body border-bottom">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5>Trạng thái đơn hàng</h5>
                            {selectedOrder ? (
                                <>
                                    <h6>Đơn hàng: {selectedOrder.orderCode}</h6>
                                    <StatusTimeline status={selectedOrder.status} />
                                    <div className="d-flex gap-2 mt-3">
                                        {/* Nút Xác nhận */}
                                        {selectedOrder.status !== 6 && ( // Chỉ hiển thị nút nếu trạng thái chưa phải là "Hoàn thành"
                                            <Button variant="primary" onClick={handleConfirm}>
                                                Xác nhận
                                            </Button>
                                        )}
                                        {/* Nút In hóa đơn */}
                                        <Button variant="success" onClick={handlePrintInvoice}>
                                            <FontAwesomeIcon icon={faPrint} className="me-2" />
                                            In hóa đơn
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <p>Chọn một đơn hàng để xem trạng thái.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="card-body border-bottom">
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-4">
                            <InputGroup>
                                <InputGroup.Text>Tìm kiếm</InputGroup.Text>
                                <Form.Control placeholder="Tìm kiếm..." />
                            </InputGroup>
                        </div>

                        <div className="col-12 col-md-4">
                            <InputGroup>
                                <Form.Control placeholder="Từ giá" />
                                <InputGroup.Text>-</InputGroup.Text>
                                <Form.Control placeholder="Đến giá" />
                            </InputGroup>
                        </div>

                        <div className="col-12 col-md-4">
                            <InputGroup>
                                <InputGroup.Text>Từ ngày</InputGroup.Text>
                                <Form.Control type="date" />
                                <InputGroup.Text>Đến ngày</InputGroup.Text>
                                <Form.Control type="date" />
                            </InputGroup>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="d-flex overflow-auto pb-2">
                        <div className="d-flex gap-2 flex-nowrap ml-auto">
                            <select className="form-select form-select-lg rounded-pill" aria-label="Trạng thái">
                                {['Tất cả', 'Chờ tiếp nhận', 'Đang vận chuyển', 'Hoàn thành', 'Đã hủy'].map((btn, idx) => (
                                    <option key={idx} value={btn}>
                                        {btn}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card-body">
                    <Table hover responsive className="mb-4">
                        <thead className="bg-light">
                            <tr>
                                <th>STT</th>
                                <th>Khách hàng</th>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Tổng tiền</th>
                                <th>Loại hóa đơn</th>
                                <th></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((order, index) => (
                                <tr
                                    key={order.id}
                                    onClick={() => handleRowClick(order.id)}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.querySelector('button').style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.querySelector('button').style.opacity = 0}
                                >
                                    <td>{index + 1}</td>
                                    <td>{order.customerName}</td>
                                    <td>{order.orderCode}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                                    <td>{order.totalPayment.toLocaleString()} VNĐ</td>
                                    <td> <span
                                        className={`badge ${order.type === 0 || order.type === 1 ? "text-dark" : "text-white"}`}
                                        style={{
                                            backgroundColor:
                                                order.type === 0 ? "#d1d3d6" :
                                                    order.type === 1 ? "#ffe8a1" :
                                                        "#ef476f",
                                            fontFamily: '"Roboto", sans-serif',
                                            fontWeight: '400',
                                            padding: '0.35rem 0.65rem',
                                            fontSize: '0.9rem',
                                        }}>
                                        {order.type === 0 ? "Tại quầy" :
                                            order.type === 1 ? "Trực tuyến" :
                                                ""}
                                    </span></td>
                                    <td>
                                        <span
                                            className={`badge ${order.status === 2 || order.status === 3 || order.status === 4 ? "text-dark" : "text-white"}`}
                                            style={{
                                                backgroundColor:
                                                    order.status === 1 ? "#d1d3d6" : // Chờ tiếp nhận
                                                        order.status === 2 ? "#ffe8a1" : // Chờ lấy hàng
                                                            order.status === 3 ? "#b8e0c4" : // Chờ vận chuyển
                                                                order.status === 4 ? "#118ab2" : // Đang vận chuyển
                                                                    order.status === 5 ? "#4caf50" : // Đã giao
                                                                        order.status === 6 ? "#4caf50" : // Hoàn tất
                                                                            "#ef476f", // Đã hủy
                                                fontFamily: '"Roboto", sans-serif',
                                                fontWeight: '400',
                                                padding: '0.35rem 0.65rem',
                                                fontSize: '0.9rem',
                                            }}>
                                            {order.status === 1 ? "Chờ tiếp nhận" :
                                                order.status === 2 ? "Chờ lấy hàng" :
                                                    order.status === 3 ? "Chờ vận chuyển" :
                                                        order.status === 4 ? "Đang vận chuyển" :
                                                            order.status === 5 ? "Đã giao" :
                                                                order.status === 6 ? "Hoàn tất" :
                                                                    "Đã hủy"}
                                        </span>
                                    </td>

                                    <td>
                                        <Button
                                            variant="link"
                                            className="p-0"
                                            style={{ opacity: 0, transition: 'all 0.3s ease', transform: 'scale(0.8)' }}
                                            onClick={() => handleNavigate(order.id)}
                                        >
                                            <img src={eyeIcon} alt="View" style={{ width: '24px', height: '24px', filter: 'grayscale(100%) opacity(0.8)' }} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={prevPage}
                        />

                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item
                                key={number + 1}
                                active={number + 1 === currentPage}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={nextPage}
                        />
                    </Pagination>
                </div>
            </div>

            {/* Toast */}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                }}
            >
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default Orders;