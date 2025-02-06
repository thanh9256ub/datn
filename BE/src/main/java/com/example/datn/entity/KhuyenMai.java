package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "khuyen_mai")
public class KhuyenMai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String ma_khuyen_mai;
    private String ten_khuyen_mai;
    private String dieu_kien;
    private Double gia_tri_giam;
    private Integer so_luong;
    private LocalDateTime ngay_bat_dau;
    private LocalDateTime ngay_ket_thuc;
    private Double gia_tri_giam_toi_da;
    private String kieu_giam_gia;
    private String trang_thai;
    private LocalDateTime ngay_tao;
    private LocalDateTime ngay_cap_nhat;
}
