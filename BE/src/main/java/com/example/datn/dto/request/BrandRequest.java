package com.example.datn.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandRequest {

    Integer id;

    @NotBlank(message = "Brand code is required")
    String brandCode;

    @NotBlank(message = "Brand name is required")
    String brandName;

    String description;
}
