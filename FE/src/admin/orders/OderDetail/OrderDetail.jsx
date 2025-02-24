import React from 'react'
import './OrderDetail.css'
import { useLocation } from 'react-router-dom'
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

    return (
        <div className="order-detail-container">
            <h1>Chi tiết đơn hàng #{order?.id}</h1>

            <div className="order-section">
                <h2>Thông tin đơn hàng</h2>
                <p>Khách hàng: {order?.customer}</p>
                <p>Ngày đặt: {order?.orderDate}</p>
                <p>Trạng thái:
                    <span className={`status-badge ${order?.status === "Đang vận chuyển" ? "shipping" :
                        order?.status === "Hoàn thành" ? "completed" :
                            "canceled"
                        }`}>
                        {order?.status}
                    </span>
                </p>
            </div>

            <div className="order-section">
                <h2>Thông tin khách hàng</h2>
                <p>Email: {customerInfo.email}</p>
                <p>SĐT: {customerInfo.phone}</p>
                <p>Địa chỉ: {customerInfo.address}</p>
            </div>

            <div className="order-section">
                <h2>Sản phẩm đã đặt</h2>
                <table>
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
                </table>
            </div>

            <div className="order-summary">
                <h2>Tổng kết</h2>
                <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{order?.total}</span>
                </div>
                <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>30,000VNĐ</span>
                </div>
                <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>150,000VNĐ</span>
                </div>
            </div>
        </div>
    )

}
export default OrderDetail;
