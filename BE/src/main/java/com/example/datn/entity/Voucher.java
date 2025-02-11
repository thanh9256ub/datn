package com.example.datn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "voucher_code")
    @NotBlank(message = "voucher code is required")
    private String ma_khuyen_mai;

    @Column(name = "voucher_name")
    private String ten_khuyen_mai;

    @Column(name = "condition")
    private String dieu_kien;

    @Column(name = "discount_value")
    private Double gia_tri_giam;

    @Column(name = "quantity")
    private Integer so_luong;

    @Column(name = "start_date")
    private LocalDateTime ngay_bat_dau;

    @Column(name = "end_date")
    private LocalDateTime ngay_ket_thuc;

    @Column(name = "max_discount_value")
    private Double gia_tri_giam_toi_da;

    @Column(name = "discount_type")
    private String kieu_giam_gia;

    @Column(name = "status")
    private String trang_thai;

    @Column(name = "created_at")
    private LocalDateTime ngay_tao;

    @Column(name = "updated_at")
    private LocalDateTime ngay_cap_nhat;
}
