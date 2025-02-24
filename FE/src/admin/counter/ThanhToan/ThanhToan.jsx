import React, { useState } from 'react';
import { Button, Form, Row, Col, InputGroup, Modal, Table } from 'react-bootstrap';

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
  const [tempDelivery, setTempDelivery] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDeliveryChange = () => {
    setTempDelivery(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDelivery(false);
  };

  const handleSaveModal = () => {
    setShowModal(false);
    setDelivery(tempDelivery);
  };

  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState('');

  const promoCodes = [
    { code: 'DISCOUNT10', discount: '10%' },
    { code: 'FREESHIP', discount: 'Miễn phí vận chuyển' },
    { code: 'SALE50', discount: 'Giảm 50K' }
  ];

  const handleShowPromoModal = () => setIsPromoModalVisible(true);
  const handleClosePromoModal = () => setIsPromoModalVisible(false);

  const handleSelectPromoCode = (code) => {
    setSelectedPromoCode(code);
    setIsPromoModalVisible(false);
  };

  return (
    <div className="container my-4">
      <h3>Thông tin thanh toán</h3>
      <hr />
      <br />

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

      {/* Giao hàng */}
      <Row className="mb-3">
        <Col sm={7} md={5}>
          <Form.Label>Giao hàng:</Form.Label>
        </Col>
        <Col sm={6} md={4}>
          <Form.Check
            type="switch"
            id="custom-switch"
            label={delivery ? "Có" : "Không"}
            checked={delivery}
            onChange={handleDeliveryChange}
          />
        </Col>
      </Row>

      {/* Modal hiển thị khi chọn giao hàng */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Họ tên</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="text" placeholder="Nguyễn Khách Huyền" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Số điện thoại</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="text" placeholder="0375161589" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Tỉnh/ Thành phố</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select">
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Quận/Huyện</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select">
                  <option>Quận Bắc Từ Liêm</option>
                  <option>Quận Nam Từ Liêm</option>
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Phường/Xã</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select">
                  <option>Phường Cổ Nhuế 1</option>
                  <option>Phường Cổ Nhuế 2</option>
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Địa chỉ cụ thể</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="text" placeholder="Nhập địa chỉ cụ thể" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Ghi chú</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="textarea" rows={3} placeholder="Nhập ghi chú" />
                <Form.Check 
                  type="checkbox" 
                  label="Lưu địa chỉ của khách hàng"
                  onChange={(e) => setTempDelivery(e.target.checked)}
                  checked={tempDelivery}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveModal}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Mã giảm giá */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control placeholder="Mã giảm giá" value={selectedPromoCode} readOnly />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={handleShowPromoModal}>
              Chọn
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Modal chọn mã giảm giá */}
      <Modal show={isPromoModalVisible} onHide={handleClosePromoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn Mã Khuyến Mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Ưu đãi</th>
                <th>Chọn</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleSelectPromoCode(promo.code)}>
                      Chọn
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePromoModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

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
