import React, { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import eyeIcon from './icons8-eyes-64.png';
import { fetchOrders, filterOrders } from './OrderService/orderService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBoxOpen, faTruck, faCheckCircle, faTimesCircle, faHome } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faDollarSign, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from '../../hook/useWebSocket';
import { toast, ToastContainer } from 'react-toastify';

const Orders = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem('currentPage')) || 1;
    });
    const [itemsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
        status: '',
    });
    const history = useHistory();
    const location = useLocation();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const { messages, isConnected } = useWebSocket("/topic/order-customer");

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    const fetchData = async (filterParams = filters) => {
        try {
            console.log('Sending filter params:', filterParams); // Log params for debugging
            const response = await filterOrders(filterParams);
            if (Array.isArray(response)) {
                console.log('Dữ liệu từ API:', response);
                setData(response);
            } else {
                console.error('Dữ liệu không hợp lệ:', response);
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching filtered orders:', error);
            setData([]);
        }
    };

    useEffect(() => {
        let mounted = true;
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (location.state?.shouldRefresh) {
            console.log('Làm mới dữ liệu từ OrderDetail');
            fetchData();
            history.replace({ ...location, state: { ...location.state, shouldRefresh: false } });
        }
    }, [location, history]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            toast.info(lastMessage);
            fetchData();
        }
    }, [messages]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'search') {
            const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '');
            setFilters((prev) => ({
                ...prev,
                [name]: sanitizedValue,
            }));
        } else if (name === 'minPrice' || name === 'maxPrice') {
            if (value === '' || (Number(value) >= 0 && !/\s/.test(value))) {
                setFilters((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        const formattedFilters = {
            ...filters,
            search: filters.search.trim() || undefined,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        };
        fetchData(formattedFilters);
    };

    const calculateTotalPayment = (order) => {
        if (!order) return 0;

        if (order.orderDetails?.length > 0) {
            const productsTotal = order.orderDetails.reduce(
                (total, item) => total + (item.totalPrice || 0),
                0
            );
            const shippingFee = order.shippingFee || 0;
            const discountValue = order.discountValue || 0;
            return productsTotal + shippingFee - discountValue;
        }

        return (order.totalPrice || 0) + (order.shippingFee || 0) - (order.discountValue || 0);
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            minPrice: '',
            maxPrice: '',
            startDate: '',
            endDate: '',
            status: '',
        });
        setCurrentPage(1);
        fetchData({});
    };

    const handleNavigate = (orderId) => {
        const order = data.find(order => order.id === orderId);
        history.push({
            pathname: `/admin/order-detail/orders/${orderId}`,
            state: { order },
        });
    };

    const handleRowClick = (orderId) => {
        const order = data.find(order => order.id === orderId);
        setSelectedOrder(order);
    };

    const getStatusName = (statusId, orderType, paymentType) => {
        let statusFlow;

        if (orderType === 0 && paymentType?.paymentTypeName === "Trực tiếp") {
            statusFlow = [

                { id: 5, name: "Hoàn tất", color: "#4caf50" },

            ];
        } else if (orderType === 0) {
            statusFlow = [
                { id: 1, name: "Chờ xác nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", color: "#118ab2" },
                { id: 5, name: "Hoàn tất", color: "#4caf50" },
                { id: 7, name: "Giao hàng không thành công", color: "#ef476f" },
                { id: 6, name: "Đã hủy", color: "#ef476f" },
            ];
        } else {
            statusFlow = [
                { id: 1, name: "Chờ xác nhận", color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", color: "#118ab2" },
                { id: 5, name: "Hoàn tất", color: "#4caf50" },
                { id: 7, name: "Giao hàng không thành công", color: "#ef476f" },
                { id: 6, name: "Đã hủy", color: "#ef476f" },
            ];
        }

        const status = statusFlow.find(s => s.id === statusId);
        return status ? { name: status.name, color: status.color } : { name: "Không xác định", color: "#6c757d" };
    };

    const StatusTimeline = ({ status, orderType, paymentType, order }) => {
        let statusFlow;

        if (orderType === 0 && paymentType?.paymentTypeName === "Trực tiếp") {
            statusFlow = [
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" }
            ];
        } else if (order.orderType === 0) {
            statusFlow = [
                { id: 1, name: "Chờ xác nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", icon: faBoxOpen, color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 7, name: "Giao hàng không thành công", icon: faTimesCircle, color: "#ef476f" },
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        } else {
            statusFlow = [
                { id: 1, name: "Chờ xác nhận", icon: faClock, color: "#ff6b6b" },
                { id: 2, name: "Đã xác nhận", icon: faBoxOpen, color: "#ffd700" },
                { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#118ab2" },
                { id: 7, name: "Giao hàng không thành công", icon: faTimesCircle, color: "#ef476f" },
                { id: 5, name: "Hoàn tất", icon: faCheckCircle, color: "#4caf50" },
                { id: 6, name: "Đã hủy", icon: faTimesCircle, color: "#ef476f" },
            ];
        }

        let visibleStatuses = [];

        if (status === 6) { // Trạng thái đã hủy
            // Chỉ hiển thị trạng thái hủy
            const cancelStatus = statusFlow.find(s => s.id === 6);
            visibleStatuses = [cancelStatus];
        } else if (status === 7) { // Trạng thái giao không thành công
            const currentStatus = statusFlow.find(s => s.id === 7);
            const previousStatuses = statusFlow.filter(s =>
                s.id < currentStatus.id &&
                s.id !== 5 &&
                s.id !== 6
            );
            visibleStatuses = [...previousStatuses, currentStatus];
        } else {
            const currentIndex = statusFlow.findIndex(s => s.id === status);
            visibleStatuses = statusFlow.slice(0, currentIndex + 1).filter(s => s.id !== 6 && s.id !== 7);
        }

        return (
            <div className="d-flex align-items-center" style={{ gap: "20px", padding: "10px 0" }}>
                {visibleStatuses.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <div className="d-flex flex-column align-items-center" style={{ gap: "8px", minWidth: "120px" }}>
                            <FontAwesomeIcon icon={s.icon} style={{
                                color: s.color,
                                fontSize: "36px",
                            }} />
                            <span style={{
                                fontSize: "16px",
                                color: s.color,
                                textAlign: "center",
                                fontWeight: index === visibleStatuses.length - 1 ? "bold" : "normal"
                            }}>{s.name}</span>
                        </div>
                        {index < visibleStatuses.length - 1 && (
                            <div style={{
                                width: "200px",
                                height: "4px",
                                backgroundColor: s.color,
                                borderRadius: "2px",
                                opacity: 0.7
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="container-fluid py-3">
            <div className="card shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-header bg-white border-bottom-0">
                    <h2>Danh sách đơn hàng</h2>
                </div>
                <div className="card-body border-bottom">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="fw-semibold">Trạng thái đơn hàng</h5>
                            {selectedOrder && (
                                <StatusTimeline
                                    status={selectedOrder.status}
                                    orderType={selectedOrder.orderType}
                                    paymentType={selectedOrder.paymentType}
                                    order={selectedOrder}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-body border-bottom">
                    <Form onSubmit={handleFilterSubmit}>
                        <div className="row g-3 mb-4 align-items-center">
                            <div className="col-12 col-md-4">
                                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                                    <InputGroup.Text className="bg-white border-0 pe-0">
                                        <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="search"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo mã đơn, số điện thoại, hoặc tên khách hàng..."
                                        className="border-0 py-2"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                </InputGroup>
                            </div>
                            <div className="col-12 col-md-4">
                                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                                    <Form.Control
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Từ giá"
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                    <InputGroup.Text className="bg-white border-0 px-1 text-muted">-</InputGroup.Text>
                                    <Form.Control
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Đến giá"
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                    <InputGroup.Text className="bg-white border-0 ps-0">
                                        <FontAwesomeIcon icon={faDollarSign} className="text-muted" />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-12 col-md-4">
                                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                                    <InputGroup.Text className="bg-white border-0 pe-0">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                        type="date"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                    <InputGroup.Text className="bg-white border-0 px-1 text-muted">-</InputGroup.Text>
                                    <Form.Control
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                        type="date"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                </InputGroup>
                            </div>
                            <div className="col-12">
                                <div className="d-flex gap-3 mt-3">
                                    <Button type="submit" variant="primary" className="rounded-pill">
                                        Lọc
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        className="rounded-pill"
                                        onClick={handleResetFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                            <div className="col-12 col-md-3 mt-3">
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="shadow-sm rounded-pill"
                                    style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="1">Chờ xác nhận</option>
                                    <option value="2">Đã tiếp nhận</option>
                                    <option value="3">Chờ vận chuyển</option>
                                    <option value="4">Đang vận chuyển</option>
                                    <option value="5">Hoàn tất</option>
                                    <option value="7">Giao không thành công</option>
                                    <option value="6">Đã hủy</option>
                                </Form.Control>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="card-body">
                    <Table
                        hover
                        responsive
                        className="mb-4 shadow-sm"
                        style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' }}
                    >
                        <thead className="bg-light" style={{ fontWeight: '600', color: '#495057' }}>
                            <tr>
                                <th className="py-3 px-4">STT</th>
                                <th className="py-3 px-4">Khách hàng</th>
                                <th className="py-3 px-4">Số điện thoại</th>
                                <th className="py-3 px-4">Mã đơn hàng</th>
                                <th className="py-3 px-4">Ngày đặt hàng</th>
                                <th className="py-3 px-4">Tổng tiền</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((order, index) => {
                                const statusInfo = getStatusName(order.status, order.orderType);
                                return (
                                    <tr
                                        key={order.id}
                                        onClick={() => handleRowClick(order.id)}
                                        className="align-middle"
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f1f3f5';
                                            e.currentTarget.querySelector('button').style.opacity = 1;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fff';
                                            e.currentTarget.querySelector('button').style.opacity = 0;
                                        }}
                                    >
                                        <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
                                        <td className="py-3 px-4">{order.customerName || 'N/A'}</td>
                                        <td className="py-3 px-4">{order.phone || 'Không có'}</td>
                                        <td className="py-3 px-4">{order.orderCode}</td>
                                        <td className="py-3 px-4">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {calculateTotalPayment(order).toLocaleString()} VNĐ
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: getStatusName(order.status, order.orderType, order.paymentType).color,
                                                    color: '#fff',
                                                    fontFamily: '"Roboto", sans-serif',
                                                    fontWeight: '500',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.95rem',
                                                    borderRadius: '12px',
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid',
                                                    borderColor: getStatusName(order.status, order.orderType, order.paymentType).color,
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                                }}
                                            >
                                                {getStatusName(order.status, order.orderType, order.paymentType).name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button
                                                variant="link"
                                                className="p-0"
                                                style={{
                                                    opacity: 0,
                                                    transition: 'all 0.3s ease',
                                                    transform: 'scale(0.9)',
                                                }}
                                                onClick={() => handleNavigate(order.id)}
                                            >
                                                <img
                                                    src={eyeIcon}
                                                    alt="View"
                                                    style={{
                                                        width: '26px',
                                                        height: '26px',
                                                        filter: 'grayscale(50%) opacity(0.7)',
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%) opacity(1)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(50%) opacity(0.7)')}
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev disabled={currentPage === 1} onClick={prevPage} />
                        {[...Array(totalPages).keys()].map((number) => (
                            <Pagination.Item
                                key={number + 1}
                                active={number + 1 === currentPage}
                                onClick={() => paginate(number + 1)}
                                className={number + 1 === currentPage ? 'shadow-sm' : ''}
                            >
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next disabled={currentPage === totalPages} onClick={nextPage} />
                    </Pagination>
                </div>
            </div>
            <style>{`
                .table th, .table td {
                    vertical-align: middle;
                }
                .badge {
                    transition: all 0.3s ease;
                }
                .badge:hover {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }
            `}</style>

            <ToastContainer />
        </div>
    );
};

export default Orders;