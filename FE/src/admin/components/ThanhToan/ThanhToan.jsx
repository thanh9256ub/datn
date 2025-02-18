import { useState } from "react";
import { Form, Button, Row, Col, ToggleButton, ToggleButtonGroup, InputGroup } from "react-bootstrap";

export default function Checkout() {
  const [delivery, setDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  return (
    <div className="border border-primary rounded p-3">
      <h5 className="text-primary border-bottom pb-2">Thông tin thanh toán</h5>
      
      <Form>
        <Form.Group controlId="deliveryToggle" className="mb-3 d-flex align-items-center">
          <Form.Label className="me-2 fw-bold">Giao hàng:</Form.Label>
          <Form.Check 
            type="switch" 
            checked={delivery} 
            onChange={() => setDelivery(!delivery)} 
          />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label>Họ tên</Form.Label>
            <Form.Control type="text" placeholder="Nguyễn Khách Huyền" />
          </Col>
          <Col>
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control type="text" placeholder="0375616589" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Tỉnh/ Thành phố</Form.Label>
            <Form.Select>
              <option>Hà Nội</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Quận/Huyện</Form.Label>
            <Form.Select>
              <option>Quận Bắc Từ Liêm</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Phường/Xã</Form.Label>
            <Form.Select>
              <option>Phường Phú Diễn</option>
            </Form.Select>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Địa chỉ cụ thể</Form.Label>
          <Form.Control type="text" placeholder="11 Hoàng Công Chất" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ghi chú cho người vận chuyển</Form.Label>
          <Form.Control type="text" placeholder="Nhập ghi chú" />
        </Form.Group>
      </Form>
      
      <hr />
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control placeholder="Nhập số điện thoại khách hàng" />
            <Button variant="success">Tìm kiếm</Button>
          </InputGroup>
          
        </Col>
       
      </Row>
      <Row className="mb-3">
        <Col>Khach hang : <span className="fw-bold">khach le</span></Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control placeholder="Mã giảm giá" />
            <Button variant="success">Chọn</Button>
          </InputGroup>
        </Col>
      </Row>

      <hr />
      <h6 className="fw-bold">Thanh toán</h6>
      <Row className="mb-3">
        <Col>Tổng tiền: <span className="fw-bold">1,500,000</span></Col>
        <Col>Giảm giá: <span className="fw-bold">- 0</span></Col>
        <Col>Phí vận chuyển: <span className="fw-bold">0</span></Col>
        <Col>Thanh toán: <span className="fw-bold">1,500,000</span></Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center">
        <ToggleButtonGroup type="radio" name="payment" value={paymentMethod} onChange={setPaymentMethod}>
          <ToggleButton id="cash" value="cash" variant="secondary">Tiền mặt</ToggleButton>
          <ToggleButton id="qr" value="qr" variant="secondary">QR</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="success">Xác nhận thanh toán</Button>
      </div>
    </div>
  );
}
