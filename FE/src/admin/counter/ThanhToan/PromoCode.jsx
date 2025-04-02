import React, { useState, useEffect } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal, Table } from 'react-bootstrap';
import { toast } from "react-toastify";
import { fetchPromoCodes } from '../api'; // Correct the relative path
import { toastOptions } from '../constants'; // Import constants

const PromoCode = ({ promo, setPromo, totalAmount, idOrder,setQrImageUrl,qrIntervalRef }) => {
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  
  useEffect(() => {
    fetchPromoCodes()
      .then(response => {
        const sortedPromoCodes = response.data.data.sort((a, b) => {
          const discountA = a.discountType === 1 
            ? Math.min((totalAmount * a.discountValue) / 100, a.maxDiscountValue) 
            : a.discountValue;
          const discountB = b.discountType === 1 
            ? Math.min((totalAmount * b.discountValue) / 100, b.maxDiscountValue) 
            : b.discountValue;
          return discountB - discountA; // Sort by highest applicable discount
        });
        setPromoCodes(sortedPromoCodes);
      })
      .catch(error => console.error('Error fetching promo codes:', error));
  }, [totalAmount]);

  const handleShowPromoModal = () => {
    setQrImageUrl(null);
    if (!idOrder||totalAmount===0) {
      toast.warn("Vui lòng chọn hóa đơn trước khi chọn mã giảm giá ", toastOptions);
      return;
    }
    setIsPromoModalVisible(true);
  };

  const handleClosePromoModal = () => setIsPromoModalVisible(false);

  const handleSelectPromoCode = (promo) => {
    setPromo(promo);
    
    setIsPromoModalVisible(false);
    toast.success("Chọn mã giảm giá thành công ", toastOptions);
    clearInterval(qrIntervalRef.current);
        qrIntervalRef.current = null;
        setQrImageUrl(null);
  };

  return (
    <>
      {/* Mã giảm giá */}
      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control placeholder="Mã giảm giá" value={promo.voucherCode||""} readOnly />
            <Button variant="primary" style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={handleShowPromoModal}>
              Chọn
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Modal chọn mã giảm giá */}
      <Modal show={isPromoModalVisible} onHide={handleClosePromoModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 'bold' }}>Chọn Mã Khuyến Mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: 'auto' }}>
          <Table  bordered hover>
            <thead>
              <tr>
                <th style={{ fontWeight: 'bold' }}>Mã</th>
                <th style={{ fontWeight: 'bold' }}>Tên</th>
                <th style={{ fontWeight: 'bold' }}>Điều kiện</th>
                <th style={{ fontWeight: 'bold' }}>Giá trị giảm</th>
                <th style={{ fontWeight: 'bold' }}>Số lượng</th>
                <th style={{ fontWeight: 'bold' }}>Giảm tối đa</th>
                <th style={{ fontWeight: 'bold' }}>Chọn</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 'bold' }}>{promo.voucherCode}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.voucherName}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.minOrderValue}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {promo.discountValue} {promo.discountType===1?"%":"VNĐ"}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{promo.quantity}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.maxDiscountValue}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleSelectPromoCode(promo)} 
                      disabled={totalAmount < promo.minOrderValue} // Fixed condition
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
          <Button variant="dark" onClick={handleClosePromoModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PromoCode;
