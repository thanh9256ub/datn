import React from 'react';
import { useState } from "react";
import { Table, Dropdown, Button } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";

export default function SanPham() {
  const [products, setProducts] = useState([
    { name: "Giày gấu", color: "Cam", size: 40, price: 400000, stock: 39 },
    { name: "Giày mèo", color: "Đen", size: 39, price: 300000, stock: 10 },
  ]);

  return (
    <div className="border border-primary rounded p-3">
      <h5>Chọn sản phẩm</h5>
      <hr />
      <div className="d-flex justify-content-between mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="light">Chọn màu</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Cam</Dropdown.Item>
            <Dropdown.Item>Đen</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="light">Chọn kích thước</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>39</Dropdown.Item>
            <Dropdown.Item>40</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="light" disabled>Tìm kiếm</Button>
      </div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Màu</th>
            <th>Kích thước</th>
            <th>Đơn giá</th>
            <th>Kho</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.color}</td>
              <td>{product.size}</td>
              <td>{product.price.toLocaleString()}</td>
              <td>{product.stock}</td>
              <td>
                <Button variant="link">
                  <Cart size={20} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
