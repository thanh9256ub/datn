import React, { useState } from "react";
import DonHang from "./DonHang/DonHang";
import SanPham from "./SanPham/SanPham";
import ThanhToan from "./ThanhToan/ThanhToan";
import { Row, Col } from 'react-bootstrap';

const BanHang = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (selectedInvoiceId === invoiceId) {
      setSelectedInvoiceId(null);
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <Row className="align-items">
        <Col md={8}>
          <div className="p-3 border">
            <DonHang onSelectInvoice={handleSelectInvoice} onDeleteInvoice={handleDeleteInvoice} />
            <SanPham selectedInvoiceId={selectedInvoiceId} />
          </div>
        </Col>
        <Col md={4}>
          <div className="p-3 border">
            <ThanhToan />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BanHang;
