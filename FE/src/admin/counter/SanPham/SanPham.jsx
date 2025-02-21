import React, { useEffect, useState } from "react";
import { Table, Dropdown, Button, Form, FormControl, Col, InputGroup } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { axiSp } from "./axiosSP";


export default function SanPham() {
  const [products, setProducts] = useState([]);

  // useEffect(async() => {
  //  let res=await axiSp();
  //  if (res && res.data) {
  //   setProducts(res.data)
  //  }
  // })

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Bạn đã tìm kiếm: ${searchTerm}`);
  };
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



        <Form inline onSubmit={handleSearch}>
          <FormControl
            type="text"
            placeholder="Tìm kiếm..."
            className="mr-sm-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />

        </Form>






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
        {/* <tbody>
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
        </tbody> */}
      </Table>
    </div>
  );
}
