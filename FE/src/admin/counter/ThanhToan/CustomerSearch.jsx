import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const CustomerSearch = ({ customer, setCustomer }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '' });

  const handleSearchCustomer = async () => {
    axios.get('http://localhost:8080/customer')
      .then(response => {
        const customer = response.data.data.find(c => c.phone === phoneNumber);

        if (!customer) {
          toast.error("Không tìm thấy khách hàng", {
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

  const handleAddCustomer = () => {
    axios.post('http://localhost:8080/customer/add', newCustomer)
      .then(response => {
        toast.success("Thêm khách hàng thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log('Thêm khách hàng:', response.data.data);
        setCustomer(response.data.data);
        setShowAddCustomerModal(false);
      })
      .catch(error => {
        console.error('Lỗi thêm khách hàng:', error);
        toast.error("Thêm khách hàng thất bại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <>
     
        <Row className="mb-3">
          <Col sm={12}>
            <Button variant="primary" onClick={() => setShowAddCustomerModal(true)}>
              Thêm khách hàng
            </Button>
          </Col>
        </Row>
      
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
            <h5 style={{ marginRight: "15px" }}>Khách hàng: {customer ? customer.fullName : 'khách lẻ'}</h5>
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

      {/* Modal thêm khách hàng */}
      <Modal show={showAddCustomerModal} onHide={() => setShowAddCustomerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Khách Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên"
                value={newCustomer.fullName}
                onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Nhập số điện thoại"
                value={newCustomer.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                  setNewCustomer({ ...newCustomer, phone: onlyNumbers });
                }}
                
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCustomerModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddCustomer}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerSearch;
