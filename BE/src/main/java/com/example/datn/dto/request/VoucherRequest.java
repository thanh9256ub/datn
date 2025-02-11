package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class VoucherRequest {

    Integer id;

    @NotBlank(message = "voucher code is required")
    private String ma_khuyen_mai;

    private String ten_khuyen_mai;

    private String dieu_kien;

    private Double gia_tri_giam;

    private Integer so_luong;

    private LocalDateTime ngay_bat_dau;

    private LocalDateTime ngay_ket_thuc;

    private Double gia_tri_giam_toi_da;

    private String kieu_giam_gia;

    private String trang_thai;

    private LocalDateTime ngay_tao;

    private LocalDateTime ngay_cap_nhat;
}
