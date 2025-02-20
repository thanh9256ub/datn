import { useEffect, useState } from "react";
import { Table, Dropdown, Button, Form, FormControl, Col, InputGroup } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import { axiSpct } from "./axiosSP";
import axios from "axios";

export default function SanPham() {
  const [productDs, setProductDs] = useState([]);

  useEffect(async () => {
    let res = await axiSpct();
    if (res && res.data) {
      setProductDs(res.data.data)
    }
  },[])

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
            <th>ID</th>
            {/* <th>Ma san pham</th>
            <th>Ten san pham</th>
            <th>Hang</th>
            <th>Danh muc</th>
            <th>Chat lieu</th>
            <th>Kich co</th>
            <th>Mau sac</th>
            <th>Gia ban</th>
            <th>Tong so luong</th> */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {productDs.map((productD, index) => (
            <tr key={index}>
              {/* <td>{productD.id}</td>
              <td>{productD.product.productCode}</td>
              <td>{productD.product.productName}</td>
              <td>{productD.product.brand.brandName}</td>
              <td>{productD.product.category.categoryName}</td>
              <td>{productD.product.material.materialName}</td>
              <td>{productD.size.sizeName}</td>
              <td>{productD.color.colorName}</td>
              <td>{productD.price.toLocaleString()}</td>
              <td>{productD.qutdantity}</td> */}
              <td>{productD.id}</td>
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
