import React from 'react';

const ProductTable = ({ products, onSelect }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="h4">Sản phẩm</h2>
      </div>
      <div className="card-body scrollable-table">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>STT</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Màu Sắc</th>
              <th>Size</th>
              <th>Giá SP</th>
              <th>Số lượng</th>
              <th>Chọn</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.ma_san_pham}</td>
                <td>{product.ten_san_pham}</td>
                <td>{product.mau_sac.ten_mau}</td>
                <td>{product.size.ten_size}</td>
                <td>{product.gia_ban}</td>
                <td>{product.so_luong_ton}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => onSelect(product)}>
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

export default ProductTable;