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
@Table(name = "chi_tiet_doi_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ChiTietDoiHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_doi_hang")
    DoiHang doiHang;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham_cu")
    ChiTietSanPham chiTietSanPhamCu;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham_moi")
    ChiTietSanPham chiTietSanPhamMoi;

    Integer so_luong_cu;

    Integer so_luong_moi;

    String ly_do_doi;

    String trang_thai;

}
