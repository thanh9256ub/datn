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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chi_tiet_doi_hang")
public class ChiTietDoiHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_doi_hang")
    private DoiHang doiHang;
    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham_cu")
    private ChiTietSanPham chiTietSanPhamCu;
    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham_moi")
    private ChiTietSanPham chiTietSanPhamMoi;
    private Integer so_luong_cu;
    private Integer so_luong_moi;
    private String ly_do_doi;
    private String trang_thai;

}
