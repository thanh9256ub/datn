import React, { useState } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import { fetchCustomers, addCustomer } from '../api'; // Correct the relative path
import { toastOptions } from '../constants'; // Import constants

const CustomerSearch = ({ customer, setCustomer, setDelivery,
  setShippingFee, totalAmount, setFinalAmount, phoneNumber,
  setPhoneNumber, setQrImageUrl, qrIntervalRef, customerInfo, setCustomerInfo }) => {

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '' });

  const handleSearchCustomer = async () => {
    // Validate phone number length
    if (phoneNumber.length !== 10) {
      toast.error("Số điện thoại phải có đúng 10 chữ số ", toastOptions);
      return;
    }

    try {

      const response = await fetchCustomers();
      const customer = response.data.data.find(c => c.phone === phoneNumber);

      if (!customer) {
        toast.error("Không tìm thấy khách hàng", toastOptions);
        return;
      }
      setQrImageUrl(null);
      setCustomer(customer);
      toast.success("Tìm thấy khách hàng ", toastOptions);
      //console.log("Khách hàng:", customer.fullName);
      setCustomerInfo({ ...customerInfo, fullName: customer.fullName, phone: customer.phone });
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);
    } catch (error) {
      console.error('Lỗi tìm kiếm khách hàng:', error);
      toast.error("Lỗi khi tìm kiếm khách hàng ", toastOptions);
    }
  };

  const handleAddCustomer = async () => {
    // Validation
    if (!newCustomer.fullName.trim()) {
      toast.error("Họ tên không được để trống ", toastOptions);
      return;
    }

    if (!newCustomer.phone.trim() || !/^\d+$/.test(newCustomer.phone)) {
      toast.error("Số điện thoại không hợp lệ ", toastOptions);
      return;
    }

    if (newCustomer.phone.length !== 10) {
      toast.error("Số điện thoại phải có đúng 10 chữ số ", toastOptions);
      return;
    }
    const response = await fetchCustomers();
    const customer = response.data.data.find(c => c.phone === newCustomer.phone);
    if (customer) {
      toast.error("Số điện thoại đã tồn tại ", toastOptions);
      return;
    }
    try {
      const response = await addCustomer(newCustomer);
      toast.success("Thêm khách hàng thành công", toastOptions);
      setCustomer(response.data.data);
      setShowAddCustomerModal(false);
      setDelivery(false);
      setShippingFee(0);
      setFinalAmount(totalAmount);
      setPhoneNumber(newCustomer.phone);
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);
      const responseCustomer  = await fetchCustomers();
      const customer = responseCustomer.data.data.find(c => c.phone === newCustomer.phone);
      setCustomer(customer);
      setCustomerInfo({ ...customerInfo, fullName: newCustomer.fullName, phone: newCustomer.phone });
    } catch (error) {
      console.error('Lỗi thêm khách hàng:', error);
      toast.error("Thêm khách hàng thất bại", toastOptions);
    }
  };

  return (
    <>

      <Row className="mb-3">
        <Col sm={12}>
          <Button variant="primary" onClick={() => {
            setShowAddCustomerModal(true)

            setQrImageUrl(null);
          }}>
            Thêm khách hàng
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control
              type="tel"
              style={{ fontWeight: 'bold' }}
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                setPhoneNumber(onlyNumbers);
              }}
            />
            <Button
              variant="primary" // Set button color to "primary"
              style={{ flex: "0 0 auto", padding: "6px 12px" }}
              onClick={handleSearchCustomer}
            >
              Tìm kiếm
            </Button>
          </InputGroup>
        </Col>

      </Row>



      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>

            <h5 style={{ marginRight: "15px", fontWeight: "bold" }}>Khách hàng: {customer ? customer.fullName : 'khách lẻ'}</h5>
            <h5
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                if (!customer) return;
                setCustomerInfo({ ...customerInfo, fullName: '', phone: '' });
                setCustomer(null);
                setPhoneNumber('');
                setDelivery(false);
                setShippingFee(0);
                toast.info("Đã xóa thông tin khách hàng ", toastOptions);
                clearInterval(qrIntervalRef.current);
                qrIntervalRef.current = null;
                setQrImageUrl(null);
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
          <Modal.Title style={{ fontWeight: 'bold' }}>Thêm Khách Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Họ tên</Form.Label>
              <Form.Control
                type="text"
                style={{ fontWeight: 'bold' }}
                placeholder="Nhập họ tên"
                value={newCustomer.fullName}
                onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                style={{ fontWeight: 'bold' }}
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
          <Button variant="dark" onClick={() => setShowAddCustomerModal(false)}>
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
