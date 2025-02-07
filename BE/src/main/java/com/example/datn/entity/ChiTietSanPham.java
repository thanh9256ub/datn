package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chi_tiet_san_pham")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "id_mau_sac")
    MauSac mauSac;

    @ManyToOne
    @JoinColumn(name = "id_kich_co")
    KichCo kichCo;

    @Column(name = "can_nang")
    Integer canNang;

    @Column(name = "gia")
    Double gia;

    @Column(name = "so_luong")
    Integer soLuong;

    @Column(name = "trang_thai")
    Integer trangThai;

    @Column(name = "ngay_tao")
    LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    LocalDateTime ngayCapNhat;

    @Column(name = "qr")
    String qr;
}
