package com.example.datn.dto.response;

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
public class ProductResponse {
    
    Integer id;

    String productCode;

    String productName;

    Brand brand;

    Category category;

    Material material;

    String mainImage;

    Integer totalQuantity = 0;

    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime updatedAt = null;
}
