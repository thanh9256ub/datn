import React, { useState } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';

export default function PaymentInfo() {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerType, setCustomerType] = useState('guest');
  const [customerName, setCustomerName] = useState('khách lẻ');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  const [change, setChange] = useState('');
  const [totalAmount] = useState(1500000);

  const customers = [
    { phone: '0375161589', name: 'Nguyễn Khách Huyền' },
    { phone: '0123456789', name: 'Trần Văn A' },
    { phone: '0987654321', name: 'Lê Thị B' },
    { phone: '0912345678', name: 'Phạm Văn C' },
    { phone: '0908765432', name: 'Nguyễn Thị D' }
  ];

  const handleSearchCustomer = () => {
    const customer = customers.find(c => c.phone === phoneNumber);
    if (customer) {
      setCustomerName(customer.name);
      setCustomerType('wholesale');
    } else {
      setCustomerName('khách lẻ');
      setCustomerType('guest');
      alert('Không tìm thấy khách hàng');
    }
  };

  const handleCloseQRModal = () => setIsQRModalVisible(false);
  const handleShowQRModal = () => {
    setIsCashPayment(false);
    setIsQRModalVisible(true);
  };

  const [delivery, setDelivery] = useState(false);

  return (
    <div className="container my-4">
      <h3>Thông tin thanh toán</h3>
      <hr />
      <br />

      <CustomerSearch
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        handleSearchCustomer={handleSearchCustomer}
        customerName={customerName}
        setCustomerName={setCustomerName}
        setCustomerType={setCustomerType}
      />

      <DeliveryInfo delivery={delivery} setDelivery={setDelivery} />

      <PromoCode selectedPromoCode={discountCode} setSelectedPromoCode={setDiscountCode} />

      {/* Thông tin thanh toán */}
      <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
      <h5>Giảm giá: 0 VND</h5>
      <h5>Phí vận chuyển: 0 VND</h5>
      <h5>Thanh toán: {totalAmount.toLocaleString()} VND</h5>

      {/* Phương thức thanh toán */}
      <Row className="mb-3">
        <Col sm={7}>
          <Button variant="light" className="w-100" onClick={() => setIsCashPayment(true)}>Tiền mặt</Button>
        </Col>
        <Col sm={5}>
          <Button variant="light" className="w-100" onClick={handleShowQRModal}>QR</Button>
        </Col>
      </Row>

      {/* Hiển thị các trường tiền khách trả và tiền thừa khi chọn Tiền mặt */}
      {isCashPayment && (
        <>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group controlId="formCashPaid">
                <Form.Label>Tiền khách trả</Form.Label>
                <Form.Control
                  type="number"
                  value={cashPaid}
                  onChange={(e) => {
                    setCashPaid(e.target.value);
                    setChange(e.target.value - totalAmount);
                  }}
                  placeholder="Nhập số tiền khách trả"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group controlId="formChange">
                <Form.Label>Tiền thừa</Form.Label>
                <Form.Control
                  type="number"
                  value={change}
                  readOnly
                  placeholder="Tiền thừa"
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      {/* Xác nhận thanh toán */}
      <Row>
        <Col sm={12}>
          <Button variant="success" className="w-100">Xác nhận thanh toán</Button>
        </Col>
      </Row>

      {/* Modal hiển thị ảnh QR */}
      <Modal show={isQRModalVisible} onHide={handleCloseQRModal}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code Thanh Toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src="https://via.placeholder.com/400x400.png?text=QR+Code"
            alt="QR Code"
            className="w-100"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
