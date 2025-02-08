package com.example.datn.dto.request;

import com.example.datn.entity.ChatLieu;
import com.example.datn.entity.DanhMuc;
import com.example.datn.entity.ThuongHieu;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class SanPhamRequest {

    Integer id;

    String maSanPham;

    String tenSanPham;

    ThuongHieu thuongHieu;

    DanhMuc danhMuc;

    ChatLieu chatLieu;

    String hinhAnhChinh;

    Integer tongSoLuong;

    LocalDateTime ngayTao;

    LocalDateTime ngayCapNhat;
}
