import React from 'react';

const OrderTable = ({ orders }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="h4">Hóa đơn</h2>
      </div>
      <div className="card-body scrollable-table">
        <table className="table table-bordered">
          <thead className="table-info">
            <tr>
              <th>STT</th>
              <th>Mã HD</th>
              <th>Tên khách</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>{order.khach_hang.ho_ten}</td>
                <td>{order.ngay_tao}</td>
                <td>{order.trang_thai}</td>
                <td>
                  <a href={`/asm2/ban-hang/xem-hoa-don/${order.id}`} className="btn btn-primary btn-sm">
                    Xem
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;