package com.example.datn.dto.response;

import com.example.datn.entity.ChatLieu;
import com.example.datn.entity.DanhMuc;
import com.example.datn.entity.ThuongHieu;
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
public class SanPhamResponse {
    
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
