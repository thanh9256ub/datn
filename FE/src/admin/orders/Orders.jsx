import React from 'react'
import Table from 'react-bootstrap/Table';
import './Order.css'
import eye_icon from './icons8-eyes-64.png'
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
        }
    ];
    return (
        <div className='table'>
            <div className='table-header'>
                <h1>Cusomter's orders</h1>
            </div>
            <div className='search-order'>
                <label htmlFor="">Tìm kiếm:</label>
                <div>
                    <input type="text" placeholder='Tìm kiếm...' />
                </div>
                <div>
                    <label htmlFor="">Khoảng giá:</label>
                    <input type="text" /><span> - </span><input type='text'></input>
                </div>
                <div>
                    <div className='search-order-date'>
                        <label htmlFor="">Từ ngày:</label>
                        <input type="date" />

                        <label htmlFor="">Đến ngày:</label>
                        <input type='date'></input>
                    </div>
                </div>
            </div>
            <div className='button-filter-order'>
                <button>Tất cả</button>
                <button>Chờ tiếp nhận</button>
                <button>Chờ đóng hàng</button>
                <button>Chờ vận chuyển</button>
                <button>Đang vận chuyển</button>
                <button>Đã nhận hàng</button>
                <button>Hoàn tất</button>
                <button>Hủy</button>
            </div>
            <div className='table-body'>
                <Table>
                    <thead>
                        <th>STT</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Actions</th>
                    </thead>
                    {data.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.customer}</td>
                            <td>{order.orderDate}</td>
                            <td>
                                <span className={
                                    order.status === "Đang vận chuyển" ? "status-shipping" :
                                        order.status === "Hoàn thành" ? "status-completed" :
                                            order.status === "Đã hủy" ? "status-canceled" : "status-default"
                                }>
                                    {order.status}
                                </span>
                            </td>
                            <td>{order.total}</td>
                            <td>
                                <button className='status-detail'>
                                    <img src={eye_icon} alt="" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
        </div>

    )
}

export default Orders