import React from "react";
import DonHang from "./DonHang/DonHang";
import SanPham from "./SanPham/SanPham";
import GioHang from "./GioHang/GioHang";
import ThanhToan from "./ThanhToan/ThanhToan"
import { Row, Col, Modal, Button } from 'react-bootstrap';

const BanHang = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      
      <Row className="align-items">

        <Col md={8}>
          <div className="p-3 border">
          <DonHang />
            <SanPham />
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
