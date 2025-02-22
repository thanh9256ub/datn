import React, { useState } from 'react';
import { Button, Form, Row, Col, InputGroup, Modal } from 'react-bootstrap';

export default function PaymentInfo() {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [delivery, setDelivery] = useState(false);
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

  return (
    <div className="container my-4">
      <h3>Thông tin thanh toán</h3>
      <Row className="mb-3">
        <Col sm={6}>

          <div style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
            <h5>Thông tin khách hàng</h5>

            {/* Giao hàng */}
            <Row className="mb-3">
              <Col sm={6} md={4}>
                <Form.Label>Giao hàng:</Form.Label>
              </Col>
              <Col sm={6} md={4}>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={delivery ? 'Có' : 'Không'}
                  checked={delivery}
                  onChange={() => setDelivery(!delivery)}
                />
              </Col>
            </Row>

            {/* Chỉ hiển thị thông tin nếu Giao hàng là true */}
            {delivery && (
              <>
                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Họ tên</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control type="text" placeholder="Nguyễn Khách Huyền" />
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Số điện thoại</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control type="text" placeholder="0375161589" />
                  </Col>
                </Row>

                {/* Các trường địa chỉ */}
                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Tỉnh/ Thành phố</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control as="select">
                      <option>Hà Nội</option>
                      <option>Hồ Chí Minh</option>
                    </Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Quận/Huyện</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control as="select">
                      <option>Quận Bắc Từ Liêm</option>
                      <option>Quận Nam Từ Liêm</option>
                    </Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Phường/Xã</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control as="select">
                      <option>Quận Bắc Từ Liêm</option>
                      <option>Quận Nam Từ Liêm</option>
                    </Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={6} md={4} className="text-start">
                    <Form.Label>Địa chỉ cụ thể</Form.Label>
                  </Col>
                  <Col sm={6} md={4}>
                    <Form.Control type="text" placeholder="0375161589" />
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={3} className="text-start">
                    <Form.Label>Ghi chú:</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập ghi chú" />
                  </Col>
                </Row>

                <Row className="mb-3 d-flex align-items-center ml-1">
                  <Col className="text-start">
                    <Form.Check type="checkbox" label="Lưu địa chỉ của khách hàng" />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>

        <Col sm={6}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
            <h5>Thông tin thanh toán</h5>

            {/* Tìm kiếm số điện thoại */}
            <Row className="mb-3">
              <Col sm={12}>
                <InputGroup>
                  <Form.Control placeholder="Nhập số điện thoại khách hàng" />
                  <Button variant="success">Tìm kiếm</Button>
                </InputGroup>
              </Col>
            </Row>

            {/* Khách hàng */}
            <Row className="mb-3 d-flex align-items-center">
              <Col sm={10}>
                <h5>Khách hàng: {customerType === 'guest' ? 'khách lẻ' : 'khách sỉ'}</h5>
              </Col>
              <Col sm={2} className="d-flex justify-content-end">
                <Button variant="light" onClick={() => setCustomerType(customerType === 'guest' ? 'wholesale' : 'guest')}>X</Button>
              </Col>
            </Row>

            {/* Mã giảm giá */}
            <Row className="mb-3">
              <Col sm={12}>
                <InputGroup>
                  <Form.Control placeholder="Ma giam gia" />
                  <Button variant="success">Chon</Button>
                </InputGroup>
              </Col>
            </Row>

            {/* Thông tin thanh toán */}
            <Row className="mb-3">
              <Col sm={6}>
                <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
              </Col>
              <Col sm={6}>
                <h5>Giảm giá: 0 VND</h5>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={6}>
                <h5>Phí vận chuyển: 0 VND</h5>
              </Col>
              <Col sm={6}>
                <h5>Thanh toán: {totalAmount.toLocaleString()} VND</h5>
              </Col>
            </Row>

            {/* Phương thức thanh toán */}
            <Row className="mb-3">
              <Col sm={6}>
                <Button variant="light" className="w-100" onClick={() => setIsCashPayment(true)}>Tiền mặt</Button>
              </Col>
              <Col sm={6}>
                <Button variant="light" className="w-100" onClick={handleShowQRModal}>QR</Button>
              </Col>
            </Row>

            {/* Hiển thị các trường tiền khách trả và tiền thừa khi chọn Tiền mặt */}
            {isCashPayment && (
              <>
                <Row className="mb-3">
                  <Col sm={6}>
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
                  <Col sm={6}>
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
          </div>
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
