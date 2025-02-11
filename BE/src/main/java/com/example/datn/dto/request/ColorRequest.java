package com.example.datn.dto.request;

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
public class ColorRequest {

    Integer id;

    @NotBlank(message = "Color code is required")
    String colorCode;

    @NotBlank(message = "Color name is required")
    String colorName;

    String description;
}
