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
@Table(name = "nhan_vien")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String ma_nhan_vien;

    private String ho_ten;

    private String gioi_tinh;

    private LocalDate ngay_sinh;

    private String sdt;

    private String dia_chi;

    private String email;

    private String ten_dang_nhap;

    private String mat_khau;

    @ManyToOne
    @JoinColumn(name = "id_vai_tro")
    private Role vaiTro;

    private LocalDateTime ngay_tao;

    private LocalDateTime ngay_cap_nhat;

    private Integer trang_thai;


}
