package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chi_tiet_gio_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CartDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_gio_hang")
    Cart gioHang;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham")
    ProductDetail productDetail;

    Integer so_luong;

    Double gia;

    Double tong_tien;

    LocalDateTime ngay_tao;

    LocalDateTime ngay_cap_nhat;

}
