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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "san_pham")
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String ma_san_pham;
    private String ten_san_pham;
    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;
    @ManyToOne
    @JoinColumn(name = "id_danh_muc")
    private DanhMuc danhMuc;
    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu chatLieu;
    private String hinh_anh_chinh;
    private Integer tong_so_luong;
    private LocalDate ngay_tao;
    private LocalDate ngay_cap_nhat;

}
