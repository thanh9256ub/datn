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

    @NotBlank(message = "Main image is required")
    String mainImage;

    @NotNull(message = "Total quantity is required")
    Integer totalQuantity;

    @NotNull(message = "Status is required")
    Integer status;
}
