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
@Table(name = "san_pham")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_san_pham")
    String maSanPham;

    @Column(name = "ten_san_pham")
    String tenSanPham;

    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc")
    DanhMuc danhMuc;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    ChatLieu chatLieu;

    @Column(name = "hinh_anh_chinh")
    String hinhAnhChinh;

    @Column(name = "tongSoLuong")
    Integer tongSoLuong;

    @Column(name = "ngay_tao")
    LocalDateTime ngayTao;

    @Column(name = "ngayCapNhat")
    LocalDateTime ngayCapNhat;

}
