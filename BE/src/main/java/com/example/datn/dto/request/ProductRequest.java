package com.example.datn.dto.request;

import com.example.datn.entity.Brand;
import com.example.datn.entity.Category;
import com.example.datn.entity.Material;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
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
public class ProductRequest {

    @NotBlank(message = "Product code is required")
    String productCode;

    @NotBlank(message = "Product name is required")
    String productName;

    @NotNull(message = "Brand ID is required")
    Integer brandId;

    @NotNull(message = "Category ID is required")
    Integer categoryId;

    @NotNull(message = "Material ID is required")
    Integer materialId;

    @NotBlank(message = "Main image is required")
    String mainImage;

//    Integer totalQuantity = 0;
//
//    LocalDateTime createdAt = LocalDateTime.now();
//
//    LocalDateTime updatedAt = null;
}
