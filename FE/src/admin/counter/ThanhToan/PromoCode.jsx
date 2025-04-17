import React, { useState, useEffect } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal, Table, Pagination } from 'react-bootstrap';
import { toast } from "react-toastify";
import { fetchPromoCodes } from '../api'; // Correct the relative path
import { toastOptions } from '../constants'; // Import constants

const PromoCode = ({ promo, setPromo, totalAmount, idOrder, setQrImageUrl, qrIntervalRef, customer }) => {
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherCodeSearchTerm, setVoucherCodeSearchTerm] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const itemsPerPage = 5;

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
          return discountB - discountA; // Sort by highest applicable discount
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
      toast.warn("Vui lòng chọn hóa đơn trước khi chọn mã giảm giá ", toastOptions);
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
    const matchesSearchTerm = promo.voucherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVoucherCode = promo.voucherCode.toLowerCase().includes(voucherCodeSearchTerm.toLowerCase());
    const matchesDiscountType =
      discountTypeFilter === "all" ||
      (discountTypeFilter === "percent" && promo.discountType === 1) ||
      (discountTypeFilter === "vnd" && promo.discountType !== 1);
    return matchesSearchTerm && matchesVoucherCode && matchesDiscountType;
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
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo mã"
            className="mb-3"
            value={voucherCodeSearchTerm}
            onChange={(e) => setVoucherCodeSearchTerm(e.target.value)}
          />
          <Form.Select
            className="mb-3"
            value={discountTypeFilter}
            onChange={(e) => setDiscountTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="percent">%</option>
            <option value="vnd">VNĐ</option>
          </Form.Select>
          <Table bordered hover>
            <thead>
              <tr>
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
                <tr key={index} onClick={() => handleSelectPromoCode(promo)}>
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
          <Pagination className="justify-content-center mt-3">
            {Array.from({ length: Math.ceil(filteredPromoCodes.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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
