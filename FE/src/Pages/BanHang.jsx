import React from "react";
import Menu from "../ClientComponents/Menu/Menu";
import DonHang from "../ClientComponents/DonHang/DonHang";
import SanPham from "../ClientComponents/SanPham/SanPham";
import GioHang from "../ClientComponents/GioHang/GioHang";
import ThanhToan from "../ClientComponents/ThanhToan/ThanhToan";
import "bootstrap/dist/css/bootstrap.min.css";

const BanHang = () => {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar Menu Fixed */}
      <div
        className="left bg-dark text-white p-3  h-100"
        style={{ height: "100%", width: "20%" }}
      >
        <Menu />
      </div>

      {/* Content Section */}
      <div
        className="right d-flex flex-grow-1 ms-3 p-3"
        style={{ marginLeft: "260px", height: "100vh" }}
      >
        <div className="Noidung" style={{ overflowY: "auto", height: "100%", width: "100%" }}>
          <DonHang />
          <SanPham />
          <GioHang />
          <ThanhToan />
        </div>
      </div>
    </div>
  );
};

export default BanHang;
