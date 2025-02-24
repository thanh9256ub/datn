import React, { useState } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal, Table } from 'react-bootstrap';

const PromoCode = ({ selectedPromoCode, setSelectedPromoCode }) => {
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);

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
    <>
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
    </>
  );
};

export default PromoCode;
