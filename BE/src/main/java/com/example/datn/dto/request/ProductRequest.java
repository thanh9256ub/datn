package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    String productName;

    @NotNull(message = "Brand ID is required")
    Integer brandId;

    @NotNull(message = "Category ID is required")
    Integer categoryId;

    @NotNull(message = "Material ID is required")
    Integer materialId;

    @NotNull(message = "Description is required")
    String description;

    @NotBlank(message = "Main image is required")
    String mainImage;

    Integer totalQuantity;

    Integer status;
}
