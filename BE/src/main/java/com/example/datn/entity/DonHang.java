package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "don_hang")
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String ma_don_hang;
    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;
    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;
    private String ten_khach_hang;
    private String sdt;
    private String dia_chi;
    private String ghi_chu;
    private Double phi_van_chuyen;
    private Double gia_tri_giam;
    private Double tong_gia;
    private Double tong_thanh_toan;
    @ManyToOne
    @JoinColumn(name = "id_hinh_thuc_thanh_toan")
    private HinhThucThanhToan hinhThucThanhToan;
    @ManyToOne
    @JoinColumn(name = "id_phuong_thuc_thanh_toan")
    private PhuongThucThanhToan phuongThucThanhToan;
    private Integer trang_thai;
    private LocalDateTime ngay_tao;
    private LocalDateTime ngay_cap_nhat;

}
