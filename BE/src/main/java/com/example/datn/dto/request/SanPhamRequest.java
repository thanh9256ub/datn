package com.example.datn.dto.request;

import com.example.datn.entity.Material;
import com.example.datn.entity.Category;
import com.example.datn.entity.Brand;
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

    Brand thuongHieu;

    Category category;

    Material material;

    String hinhAnhChinh;

    Integer tongSoLuong;

    LocalDateTime ngayTao;

    LocalDateTime ngayCapNhat;
}
