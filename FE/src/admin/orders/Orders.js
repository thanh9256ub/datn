import React, { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import eyeIcon from './icons8-eyes-64.png';
import { fetchOrders, filterOrders } from './OrderService/orderService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBoxOpen, faTruck, faCheckCircle, faTimesCircle, faHome } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faDollarSign, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem('currentPage')) || 1;
    });
    const [itemsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filters, setFilters] = useState({
        orderCode: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
    });
    const history = useHistory();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    const fetchData = async () => {
        try {
            const response = await filterOrders(filters);
            if (Array.isArray(response)) {
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
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchData();
    };

    const handleResetFilters = () => {
        setFilters({
            orderCode: '',
            minPrice: '',
            maxPrice: '',
            startDate: '',
            endDate: ''
        });
        setCurrentPage(1);
        fetchData();
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

    const StatusTimeline = ({ status }) => {
        const statusFlow = [
            { id: 1, name: "Chờ tiếp nhận", icon: faClock, color: "#f59e0b" },
            { id: 2, name: "Chờ lấy hàng", icon: faBoxOpen, color: "#f59e0b" },
            { id: 3, name: "Chờ vận chuyển", icon: faTruck, color: "#f97316" },
            { id: 4, name: "Đang vận chuyển", icon: faTruck, color: "#f97316" },
            { id: 5, name: "Đã giao", icon: faHome, color: "#10b981" },
            { id: 6, name: "Hoàn tất", icon: faCheckCircle, color: "#10b981" },
            { id: 7, name: "Đã hủy", icon: faTimesCircle, color: "#ef4444" },
        ];
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

    return (
        <div className="container-fluid py-3">
            <div className="card shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-header bg-white border-bottom-0">
                    <h2 className="mb-0 fw-bold text-primary">Customer's Orders</h2>
                </div>

                <div className="card-body border-bottom">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="fw-semibold">Trạng thái đơn hàng</h5>
                            {selectedOrder ? (
                                <>
                                    <h6 className="text-muted">Đơn hàng: {selectedOrder.orderCode}</h6>
                                    <StatusTimeline status={selectedOrder.status} />
                                </>
                            ) : (
                                <p className="text-muted">Chọn một đơn hàng để xem trạng thái.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-body border-bottom">
                    <Form onSubmit={handleFilterSubmit}>
                        <div className="row g-3 mb-4 align-items-center">
                            {/* Ô tìm kiếm */}
                            <div className="col-12 col-md-4">
                                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                                    <InputGroup.Text className="bg-white border-0 pe-0">
                                        <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="orderCode"
                                        value={filters.orderCode}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm kiếm đơn hàng..."
                                        className="border-0 py-2"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                </InputGroup>
                            </div>

                            {/* Ô lọc theo giá */}
                            <div className="col-12 col-md-4">
                                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                                    <Form.Control
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Từ giá"
                                        type="number"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                    <InputGroup.Text className="bg-white border-0 px-1 text-muted">-</InputGroup.Text>
                                    <Form.Control
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Đến giá"
                                        type="number"
                                        className="border-0 py-2 text-center"
                                        style={{ boxShadow: "none", backgroundColor: "#f8f9fa" }}
                                    />
                                    <InputGroup.Text className="bg-white border-0 ps-0">
                                        <FontAwesomeIcon icon={faDollarSign} className="text-muted" />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>

                            {/* Ô lọc theo ngày */}
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
                            <div className="col-12 col-md-3 mt-3" >
                                <Form.Control as="select"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="shadow-sm rounded-pill"
                                    style={{ backgroundColor: "#f8f9fa" }}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="1">Chờ</option>
                                    <option value="2">Lấy hàng</option>
                                    <option value="3">Vận chuyển</option>
                                    <option value="4">Vận chuyển</option>
                                    <option value="5">Giao</option>
                                    <option value="6">Hoàn</option>
                                    <option value="7">Hủy</option>
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
                                <th className="py-3 px-4">Mã đơn hàng</th>
                                <th className="py-3 px-4">Ngày đặt hàng</th>
                                <th className="py-3 px-4">Tổng tiền</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((order, index) => (
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
                                    <td className="py-3 px-4">{order.orderCode}</td>
                                    <td className="py-3 px-4">{new Date(order.createdDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{order.totalPrice.toLocaleString()} VNĐ</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor:
                                                    order.status === 1 ? "#fef3c7" :
                                                        order.status === 2 ? "#fef3c7" :
                                                            order.status === 3 ? "#ffedd5" :
                                                                order.status === 4 ? "#ffedd5" :
                                                                    order.status === 5 ? "#d1fae5" :
                                                                        order.status === 6 ? "#d1fae5" :
                                                                            "#fee2e2",
                                                color:
                                                    order.status === 1 ? "#f59e0b" :
                                                        order.status === 2 ? "#f59e0b" :
                                                            order.status === 3 ? "#f97316" :
                                                                order.status === 4 ? "#f97316" :
                                                                    order.status === 5 ? "#10b981" :
                                                                        order.status === 6 ? "#10b981" :
                                                                            "#ef4444",
                                                borderColor:
                                                    order.status === 1 ? "#f59e0b" :
                                                        order.status === 2 ? "#f59e0b" :
                                                            order.status === 3 ? "#f97316" :
                                                                order.status === 4 ? "#f97316" :
                                                                    order.status === 5 ? "#10b981" :
                                                                        order.status === 6 ? "#10b981" :
                                                                            "#ef4444",
                                                fontFamily: '"Roboto", sans-serif',
                                                fontWeight: '500',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.95rem',
                                                borderRadius: '12px',
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            }}
                                        >
                                            {order.status === 1 ? "Chờ tiếp nhận" :
                                                order.status === 2 ? "Chờ lấy hàng" :
                                                    order.status === 3 ? "Chờ vận chuyển" :
                                                        order.status === 4 ? "Đang vận chuyển" :
                                                            order.status === 5 ? "Đã giao" :
                                                                order.status === 6 ? "Hoàn tất" :
                                                                    "Đã hủy"}
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
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(50%) opacity(0.7)'}
                                            />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination className="justify-content-center">
                        <Pagination.Prev disabled={currentPage === 1} onClick={prevPage} />
                        {[...Array(totalPages).keys()].map(number => (
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

            <style >{`
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
        </div>
    );
};

export default Orders;