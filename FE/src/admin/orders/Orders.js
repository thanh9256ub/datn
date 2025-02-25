
import React, { useState } from 'react';
import { Table, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import eyeIcon from './icons8-eyes-64.png';
const Orders = () => {
    const data = [
        {
            id: 1,
            customer: "KhachHang1",
            orderDate: "1/2/2025",
            status: "Đang vận chuyển",
            total: "120000VNĐ"
        },
        {
            id: 2,
            customer: "KhachHang2",
            orderDate: "2/2/2025",
            status: "Hoàn thành",
            total: "230000VNĐ"
        },
        {
            id: 3,
            customer: "KhachHang3",
            orderDate: "3/2/2025",
            status: "Đã hủy",
            total: "50000VNĐ"
        },
        {
            id: 4,
            customer: "KhachHang4",
            orderDate: "1/2/2025",
            status: "Đang vận chuyển",
            total: "120000VNĐ"
        },
        {
            id: 5,
            customer: "KhachHang5",
            orderDate: "2/2/2025",
            status: "Hoàn thành",
            total: "230000VNĐ"
        },
        {
            id: 6,
            customer: "KhachHang6",
            orderDate: "3/2/2025",
            status: "Đã hủy",
            total: "50000VNĐ"
        },
    ];
    // 1. Khai báo state quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1); // Trang mặc định là 1
    const [itemsPerPage] = useState(5); // Cố định 5 items/trang

    // 2. Tính toán dữ liệu cần hiển thị
    const indexOfLastItem = currentPage * itemsPerPage; // Vị trí cuối (5,10,15...)
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Vị trí đầu (0,5,10...)
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // Cắt mảng data

    // 3. Tính tổng số trang
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // 4. Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
    const history = useHistory(); // Thay navigate bằng history

    const handleNavigate = (orderId) => {
        // Tìm đơn hàng theo ID để truyền vào state
        const order = data.find(order => order.id === orderId);
        history.push({
            pathname: `/admin/orders/${orderId}`,  // Điều hướng đến URL với id của đơn hàng
            state: { order }  // Truyền dữ liệu qua state
        });
    };
    
    return (
        <div className="container-fluid py-3">
            <div className="card shadow">
                <div className="card-header bg-white border-bottom-0">
                    <h2 className="mb-0">Customer's Orders</h2>
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
                                <Form.Control placeholder="Ví dụ: 120000" />
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
                        <div className="d-flex gap-2 flex-nowrap">
                            {['Tất cả', 'Chờ tiếp nhận', 'Chờ đóng hàng', 'Chờ vận chuyển', 
                            'Đang vận chuyển', 'Đã nhận hàng', 'Hoàn tất', 'Hủy'].map((btn, idx) => (
                                <Button 
                                    key={idx}
                                    variant="outline-primary"
                                    className="text-nowrap rounded-pill"
                                >
                                    {btn}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card-body">
                    <Table  hover responsive className="mb-4">
                        <thead className="bg-light">
                            <tr>
                                <th>STT</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Trạng thái</th>
                                <th>Tổng tiền</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                                {currentItems.map((order, index) => (
                                    <tr 
                                    key={order.id}
                                    style={{ 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    >
                                    <td>{index + 1}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.orderDate}</td>
                                    <td>
                                        <span className={`badge ${
                                        order.status === "Đang vận chuyển" ? "bg-warning text-dark" :
                                        order.status === "Hoàn thành" ? "bg-success" :
                                        order.status === "Đã hủy" ? "bg-danger" : "bg-secondary"
                                        }`}>
                                        {order.status}
                                        </span>
                                    </td>
                                    <td>{order.total}</td>
                                    <td>
                                        <Button variant="link" className="p-0"style={{ opacity: 0,transition: 'all 0.3s ease',transform: 'scale(0.8)'}}
                                       onClick={() => handleNavigate(order.id)} >
                                        <img src={eyeIcon} alt="View" style={{  width: '24px', height: '24px',filter: 'grayscale(100%) opacity(0.8)'}} />
                                        </Button>
                                    </td>
                                    </tr>
                                ))}
                        </tbody>
                                <style>
                                {`
                                    tr:hover button {
                                    opacity: 1 !important;
                                    transform: scale(1) !important;
                                    }
                                    tr:hover img {
                                    filter: none !important;
                                    }
                                `}
                                </style>
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
        </div>
    );
}

export default Orders