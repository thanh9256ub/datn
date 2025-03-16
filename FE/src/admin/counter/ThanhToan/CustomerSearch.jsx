import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
const CustomerSearch = ({ customer, setCustomer }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
 
  const handleSearchCustomer = async () => {
   

    axios.get('http://localhost:8080/customer')
      .then(response => {
        const customer = response.data.data.find(c => c.phone === phoneNumber);

        if (!customer) {
          toast.error("Không tìn thấy khách hàng ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

        setCustomer(customer);
       
      })
      .catch(error => {
        console.error('Lỗi tìm kiếm khách hàng:', error);
       
      });
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
        
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <h5 style={{ marginRight: "15px" }}>Khách hàng: {customer ? customer.fullName  : 'khách lẻ'}</h5>
            <h5
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                setCustomer(null);
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
