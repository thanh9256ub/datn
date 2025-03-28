package com.example.datn.dto.response;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
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
public class VoucherResponse {

    Integer id;

    String voucherCode;

    String voucherName;

    Integer discountType;

    Integer quantity;

    Double discountValue;

    Double minOrderValue;

    Double maxDiscountValue;

    LocalDateTime startDate;

    LocalDateTime endDate;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updateAt;
}
