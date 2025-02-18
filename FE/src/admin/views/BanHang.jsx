import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DonHang from "../components/DonHang/DonHang";
import SanPham from "../components/SanPham/SanPham";
import GioHang from "../components/GioHang/GioHang";
import ThanhToan from "../components/ThanhToan/ThanhToan";

const BanHang = () => {
  return (
   
        <div >
          <DonHang />
          <SanPham />
          <GioHang />
          <ThanhToan />
        </div>
      
  );
};

export default BanHang;
