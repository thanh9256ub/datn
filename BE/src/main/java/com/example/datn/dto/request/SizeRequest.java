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
public class SizeRequest {

    Integer id;

    @NotBlank(message = "Size code is required")
    String sizeCode;

    @NotBlank(message = "Size name is required")
    String sizeName;

    String description;
}
