import React, { useState, useEffect } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

const PromoCode = ({ promoCode, setPromo, totalAmount }) => {
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8080/voucher/list')
      .then(response => {
        setPromoCodes(response.data.data);
      })
      .catch(error => console.error('Error fetching promo codes:', error));
  }, []);

  const handleShowPromoModal = () => setIsPromoModalVisible(true);
  const handleClosePromoModal = () => setIsPromoModalVisible(false);

  const handleSelectPromoCode = (promo) => {
    setPromo(promo);
    setIsPromoModalVisible(false);
  };

  return (
    <>
      {/* Mã giảm giá */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control placeholder="Mã giảm giá" value={promoCode} readOnly />
            <Button variant="success" style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={handleShowPromoModal}>
              Chọn
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Modal chọn mã giảm giá */}
      <Modal show={isPromoModalVisible} onHide={handleClosePromoModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chọn Mã Khuyến Mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: 'auto' }}>
          <Table  bordered hover>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên</th>
                <th>Điều kiện</th>
                <th>Giá trị giảm</th>
                <th>Số lượng</th>
                <th>Giảm tối đa</th>
                <th>Chọn</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index}>
                  <td>{promo.voucherCode}</td>
                  <td>{promo.voucherName}</td>
                  <td>{promo.condition}</td>
                  <td>
                    {promo.discountValue} {promo.discountType}
                  </td>
                  <td>{promo.quantity}</td>
                  <td>{promo.maxDiscountValue}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleSelectPromoCode(promo)} 
                      disabled={totalAmount < promo.condition}
                    >
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
    </>
  );
};

export default PromoCode;
