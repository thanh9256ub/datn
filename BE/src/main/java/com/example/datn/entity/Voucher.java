package com.example.datn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "voucher")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "voucher_code")
    String voucherCode;

    @Column(name = "voucher_name")
    String voucherName;

    @Column(name = "discount_type")
    String discountType;

    @Column(name = "quantity")
    Integer quantity;

    @Column(name = "discount_value")
    Double discountValue;

//    @Column(name = "min_order_value")
//    Double minOrderValue;
//
//    @Column(name = "max_discount_value")
//    Double maxDiscountValue;

    @Column(name = "start_date")
    LocalDateTime startDate;

    @Column(name = "end_date")
    LocalDateTime endDate;

    @Column(name = "status")
    Integer status;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now().withNano(0);

    @Column(name = "updated_at")
    LocalDateTime updateAt = null;

}
