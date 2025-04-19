import React, { useState, useEffect } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal, Table } from 'react-bootstrap';
import { toast } from "react-toastify";
import { fetchPromoCodes } from '../api'; // Ensure fetchPromoCodes is a named export
import { toastOptions } from '../constants'; // Ensure toastOptions is a named export

const PromoCode = ({ promo, setPromo, totalAmount, idOrder, setQrImageUrl, qrIntervalRef, customer }) => {
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [searchName, setSearchName] = useState(""); // Search by name
  const [searchCode, setSearchCode] = useState(""); // Search by code
  const [filterDiscountType, setFilterDiscountType] = useState(""); // Filter by discount type
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchPromoCodes()
      .then(response => {
        const activePromoCodes = response.data.data.filter(promo => promo.status === 1); // Filter by status=1
        const sortedPromoCodes = activePromoCodes.sort((a, b) => {
          const discountA = a.discountType === 1 
            ? Math.min((totalAmount * a.discountValue) / 100, a.maxDiscountValue) 
            : a.discountValue;
          const discountB = b.discountType === 1 
            ? Math.min((totalAmount * b.discountValue) / 100, b.maxDiscountValue) 
            : b.discountValue;
          return discountB - discountA; 
        });
        setPromoCodes(sortedPromoCodes);
      })
      .catch(error => console.error('Error fetching promo codes:', error));
  }, [totalAmount]);

  const handleShowPromoModal = () => {
    setQrImageUrl(null);
    if (!customer) {
      toast.warn("Chỉ áp dụng cho khách có tài khoản  ", toastOptions);
      return;
    }
    if (!idOrder) {
      toast.warn("Vui lòng chọn hóa đơn trước khi chọn mã giảm giá ", toastOptions);
      return;
    }
    if (totalAmount===0) {
      toast.warn("Vui lòng thêm sản trước khi chọn mã giảm giá ", toastOptions);
      return;
    }
    setIsPromoModalVisible(true);
  };

  const handleClosePromoModal = () => setIsPromoModalVisible(false);

  const handleSelectPromoCode = (promo) => {
    
    if (totalAmount < promo.minOrderValue) {
      toast.warn("Đơn hàng chưa đủ điều kiệnkiện", toastOptions);
      return;
    }
    setPromo(promo);
    
    setIsPromoModalVisible(false);
    toast.success("Chọn mã giảm giá thành công ", toastOptions);
    clearInterval(qrIntervalRef.current);
        qrIntervalRef.current = null;
        setQrImageUrl(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredPromoCodes = promoCodes.filter((promo) => {
    return (
      promo.voucherName.toLowerCase().includes(searchName.toLowerCase()) &&
      promo.voucherCode.toLowerCase().includes(searchCode.toLowerCase()) &&
      (filterDiscountType === "" || promo.discountType === parseInt(filterDiscountType))
    );
  });

  const paginatedPromoCodes = filteredPromoCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value.trimStart())}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo mã"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.trimStart())}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={filterDiscountType}
                onChange={(e) => setFilterDiscountType(e.target.value)}
                style={{
                
                  fontWeight: "bold",
                  color: "black", 
                  backgroundColor: "white",   
                }}
              >
                <option value="">Tất cả</option>
                <option value="1">%</option>
                <option value="0">VNĐ</option>
              </Form.Control>
            </Col>
          </Row>
          <div style={{ height: '275px' }}>
          <Table  bordered hover >
            <thead>
              <tr>
                <th style={{ fontWeight: 'bold' }}>STT</th> 
                <th style={{ fontWeight: 'bold' }}>Mã</th>
                <th style={{ fontWeight: 'bold' }}>Tên</th>
                <th style={{ fontWeight: 'bold' }}>Điều kiện</th>
                <th style={{ fontWeight: 'bold' }}>Giá trị giảm</th>
                <th style={{ fontWeight: 'bold' }}>Số lượng</th>
                <th style={{ fontWeight: 'bold' }}>Giảm tối đa</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPromoCodes.map((promo, index) => (
                <tr key={index} onClick={() => handleSelectPromoCode(promo)} 
                >
                  <td style={{ fontWeight: 'bold' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td> 
                  <td style={{ fontWeight: 'bold' }}>{promo.voucherCode}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.voucherName}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.minOrderValue}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {promo.discountValue} {promo.discountType===1?"%":"VNĐ"}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{promo.quantity}</td>
                  <td style={{ fontWeight: 'bold' }}>{promo.maxDiscountValue}</td>
                 
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredPromoCodes.length / itemsPerPage) }, (_, i) => (
              <Button
                key={i}
                variant={i + 1 === currentPage ? "primary" : "secondary"}
                onClick={() => handlePageChange(i + 1)}
                style={{ height: "30px", width: "30px",padding: "8px", margin: "0 2px" }}
             
              >
                {i + 1}
              </Button>
            ))}
          </div>
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
