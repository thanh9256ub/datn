package com.example.datn.dto.request;

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
public class VoucherRequest {

    private Integer id;

    private String voucherCode;

    private String voucherName;

    private String condition;

    private Double discountValue;

    private Integer quantity;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Double maxDiscountValue;

    private String discountType;

    private String status;

    LocalDateTime createdAt ;

    LocalDateTime updateAt ;
}