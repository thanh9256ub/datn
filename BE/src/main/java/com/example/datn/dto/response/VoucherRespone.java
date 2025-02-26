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
public class VoucherRespone {

    Integer id;

    String voucherCode;

    String voucherName;

    String condition;

    Double discountValue;

    Integer quantity;

    LocalDateTime startDate;

    LocalDateTime endDate;

    Double maxDiscountValue;

    String discountType;

    String status;

    LocalDateTime createdAt ;

    LocalDateTime updateAt ;
}
