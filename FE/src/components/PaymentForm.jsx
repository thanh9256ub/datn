import React, { useState } from 'react';

const PaymentForm = ({ customer, order, total, message, onSubmit, onTimKhachHang, onTaoHoaDon, setCustomer }) => {
    const [sdt, setSdt] = useState(customer.sdt);

    const handleSdtChange = (e) => {
        setSdt(e.target.value);
        setCustomer({ ...customer, sdt: e.target.value });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="h4">Thanh toán</h2>
            </div>
            <div className="card-body">
                {message && <div className="alert alert-danger">{message}</div>}

                {/* Tìm kiếm khách hàng */}
                <form onSubmit={onTimKhachHang} className="mb-3">
                    <div className="mb-3">
                        <label htmlFor="soDT" className="form-label">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="soDT"
                            name="soDT"
                            value={sdt}
                            onChange={handleSdtChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Tìm kiếm
                    </button>
                </form>

                <button onClick={onTaoHoaDon} className="btn btn-primary mt-3">
                    Tạo hóa đơn mới
                </button>

                {/* Form thanh toán */}
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="tenKH" className="form-label">
                            Tên khách hàng
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="tenKH"
                            name="tenKH"
                            value={customer.ho_ten}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="id" className="form-label">
                            ID hoa don
                        </label>
                        <input type="text" className="form-control" id="id" name="id" readOnly value={order.id} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tongTien" className="form-label">
                            Tổng tiền
                        </label>
                        <input type="text" className="form-control" id="tongTien" name="tongTien" readOnly value={total} />
                    </div>

                    <button type="submit" className="btn btn-success">
                        Thanh toán
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;