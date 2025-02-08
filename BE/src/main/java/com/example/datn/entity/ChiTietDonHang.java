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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chi_tiet_don_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_don_hang")
    Order order;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham")
    ChiTietSanPham chiTietSanPham;

    Integer so_luong;

    Double gia;

    Double tong_gia;

    Integer trang_thai;

    Integer trang_thai_san_pham;


}
