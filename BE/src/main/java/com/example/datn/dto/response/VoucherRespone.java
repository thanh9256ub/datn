package com.example.datn.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRespone {

    Integer id;

    String ma_khuyen_mai;

    String ten_khuyen_mai;

    String dieu_kien;

    Double gia_tri_giam;

    Integer so_luong;

    LocalDateTime ngay_bat_dau;

    LocalDateTime ngay_ket_thuc;

    Double gia_tri_giam_toi_da;

    String kieu_giam_gia;

    String trang_thai;

    LocalDateTime ngay_tao;

    LocalDateTime ngay_cap_nhat;
}
