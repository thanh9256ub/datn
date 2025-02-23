import React, { useState } from 'react';
import { Button, Form, Row, Col, InputGroup, Modal } from 'react-bootstrap';

export default function PaymentInfo() {
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [customerType, setCustomerType] = useState('guest');
  const [discountCode, setDiscountCode] = useState('');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false); // Trạng thái để hiển thị modal
  const [cashPaid, setCashPaid] = useState('');
  const [change, setChange] = useState('');
  const [totalAmount] = useState(1500000);

  const handleCloseQRModal = () => setIsQRModalVisible(false);
  const handleShowQRModal = () => {
    setIsCashPayment(false); // Ẩn các trường Tiền mặt khi mở modal QR
    setIsQRModalVisible(true);
  };

  
  const [delivery, setDelivery] = useState(false);
  const [tempDelivery, setTempDelivery] = useState(false); // State tạm khi mở modal
  const [showModal, setShowModal] = useState(false);

  const handleDeliveryChange = () => {
    setTempDelivery(true); // Mở modal với trạng thái tạm
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDelivery(false); // Khi đóng modal, giao hàng trở về "Không"
  };

  const handleSaveModal = () => {
    setShowModal(false);
    setDelivery(tempDelivery); // Giữ nguyên trạng thái khi lưu
  };

  return (
    <div className="container my-4">




      <h3>Thong tin thanh toan</h3>
      <hr />
      <br />

      {/* Tìm kiếm số điện thoại */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control placeholder="Nhập số điện thoại khách hàng" />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }}>
              Tìm kiếm
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Khách hàng */}
      <Row className="mb-3">
  <Col sm={12}>
    <InputGroup>
      <h5 style={{ marginRight: "15px" }}>Khách hàng: {customerType === 'guest' ? 'khách lẻ' : 'khách sỉ'}</h5>
      <h5 
        style={{ cursor: "pointer" }} 
        onClick={() => setCustomerType(customerType === 'guest' ? 'wholesale' : 'guest')}
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
                  onChange={(e) => setTempDelivery(e.target.checked)} // Cập nhật tempDelivery
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
            <Form.Control placeholder="Ma giam gia" />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }}>
              Chon
            </Button>
          </InputGroup>
        </Col>
      </Row>

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
            src="https://via.placeholder.com/400x400.png?text=QR+Code" // Thay ảnh QR của bạn ở đây
            alt="QR Code"
            className="w-100"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
