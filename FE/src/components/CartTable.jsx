import React from 'react';

const CartTable = ({ cartItems, onEdit }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="h4">Giỏ hàng</h2>
      </div>
      <div className="card-body scrollable-table">
        <table className="table table-bordered">
          <thead className="table-warning">
            <tr>
              <th>STT</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Giá SP</th>
              <th>Số lượng mua</th>
              <th>Tổng tiền</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.ctsp.san_pham.ma_san_pham}</td>
                <td>{item.ctsp.san_pham.ten_san_pham}</td>
                <td>{item.gia_ban}</td>
                <td>{item.so_luong_mua}</td>
                <td>{item.tong_tien}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => onEdit(item)}>
                    Chọn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartTable;