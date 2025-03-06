import React, { useState } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';

const PaymentInfo = ({ totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customer, setCustomer] = useState(null);
 
  const [discountCode, setDiscountCode] = useState('');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  const [change, setChange] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  const handleShowQRModal = () => {
    setIsCashPayment(false);

    // URL QR từ VietQR với thông tin thanh toán
    const qrUrl = `https://img.vietqr.io/image/MB-20046666666-compact2.jpg?amount=${totalAmount}&addInfo=thanh%20toan%20hoa%20don%20cua%20TUAN&accountName=HOANG%20VAN%20TUAN`;
    setQrImageUrl(qrUrl);

    setIsQRModalVisible(true);
  };

  const handleCloseQRModal = () => setIsQRModalVisible(false);

  return (
    <div className="container my-4">
      <h3>Thông tin thanh toán</h3>
      <hr />
      <br />

      <CustomerSearch
      
        customer={customer}
        setCustomer={setCustomer}
       
      />

      <DeliveryInfo delivery={false} setDelivery={() => {}} />
      <PromoCode selectedPromoCode={discountCode} setSelectedPromoCode={setDiscountCode} />

      {/* Hiển thị tổng tiền */}
      <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
      <h5>Giảm giá: 0 VND</h5>
      <h5>Phí vận chuyển: 0 VND</h5>
      <h5>Thanh toán: {totalAmount.toLocaleString()} VND</h5>

      {/* Chọn phương thức thanh toán */}
      <Row className="mb-3">
        <Col sm={7}>
          <Button variant="light" className="w-100" onClick={() => setIsCashPayment(true)}>Tiền mặt</Button>
        </Col>
        <Col sm={5}>
          <Button variant="light" className="w-100" onClick={handleShowQRModal}>QR</Button>
        </Col>
      </Row>

      {/* Hiển thị ô nhập tiền khách trả nếu chọn tiền mặt */}
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
      <Modal show={isQRModalVisible} onHide={handleCloseQRModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code Thanh Toán</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code Thanh Toán" className="img-fluid" />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentInfo;