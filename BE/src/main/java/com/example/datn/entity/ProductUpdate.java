package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product_code")
    private String productCode;

    @Column(name = "new_total_quantity")
    private Integer newTotalQuantity;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

