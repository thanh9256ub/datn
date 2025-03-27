package com.example.datn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "voucher_name")
    private String voucherName;

    @Column(name = "condition")
    private String condition;

    @Column(name = "discount_value")
    private Double discountValue;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "max_discount_value")
    private Double maxDiscountValue;

    @Column(name = "discount_type")
    private String discountType;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now().withNano(0);

    @Column(name = "updated_at")
    LocalDateTime updateAt = LocalDateTime.now().withNano(0);

}
