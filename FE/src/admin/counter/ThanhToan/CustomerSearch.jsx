import React from 'react';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';

const CustomerSearch = ({ phoneNumber, setPhoneNumber, handleSearchCustomer, customerName, setCustomerName, setCustomerType }) => {
  return (
    <>
      {/* Tìm kiếm số điện thoại */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control
              placeholder="Nhập số điện thoại khách hàng"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={handleSearchCustomer}>
              Tìm kiếm
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Khách hàng */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <h5 style={{ marginRight: "15px" }}>Khách hàng: {customerName}</h5>
            <h5
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCustomerType('guest');
                setCustomerName('khách lẻ');
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
