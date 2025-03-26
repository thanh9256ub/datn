package com.example.datn.dto.response;

import com.example.datn.entity.Material;
import com.example.datn.entity.Category;
import com.example.datn.entity.Brand;
import jakarta.validation.constraints.NotNull;
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

    String description;

    String mainImage;

    Integer totalQuantity;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}
