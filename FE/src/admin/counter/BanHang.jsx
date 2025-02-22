import React from "react";
import DonHang from "./DonHang/DonHang";
import SanPham from "./SanPham/SanPham";
import GioHang from "./GioHang/GioHang";
import ThanhToan from "./ThanhToan/ThanhToan"

const BanHang = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <DonHang />
     <SanPham />
   
      <ThanhToan />
     
    </div>

  );
};

export default BanHang;
