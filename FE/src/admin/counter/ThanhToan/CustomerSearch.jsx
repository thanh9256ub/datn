import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';

const CustomerSearch = ({ phoneNumber, setPhoneNumber, customerName, setCustomerName, setCustomerType }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchCustomer = async () => {

    setErrorMessage('Đang tìm kiếm...');

    axios.get('http://localhost:8080/customer')
      .then(response => {
        // Chuẩn hóa số điện thoại: loại bỏ dấu cách và chỉ giữ lại số
        const normalizedPhoneNumber = phoneNumber.trim().replace(/\D/g, '');

        const customer = response.data.data.find(c =>
          c.phone.replace(/\D/g, '') === normalizedPhoneNumber
        );

        if (!customer) {
          setErrorMessage('Không tìm thấy khách hàng');
          return;
        }

        setCustomerName(customer.fullName);
        setErrorMessage('');
      })
      .catch(error => console.error('Lỗi tìm kiếm khách hàng:', error));


  };

  return (
    <>
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                setPhoneNumber(onlyNumbers);
              }}
            />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={handleSearchCustomer}>
              Tìm kiếm
            </Button>
          </InputGroup>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <h5 style={{ marginRight: "15px" }}>Khách hàng: {customerName}</h5>
            <h5
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                setCustomerType('guest');
                setCustomerName('khách lẻ');
                setPhoneNumber('');
              }}
            >
              X
            </h5>
          </InputGroup>
        </Col>
      </Row>
    </>
  );
};

export default CustomerSearch;
