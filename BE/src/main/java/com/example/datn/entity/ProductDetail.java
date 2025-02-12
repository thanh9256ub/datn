package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ProductDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product product;

    @ManyToOne
    @JoinColumn(name = "color_id")
    Color color;

    @ManyToOne
    @JoinColumn(name = "size_id")
    Size size;

    @Column(name = "price")
    Double price;

    @Column(name = "quantity")
    Integer quantity;

    @Column(name = "status")
    Integer status;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now().withNano(0);

    @Column(name = "updated_at")
    LocalDateTime updatedAt = null;

    @Column(name = "qr")
    String qr;
}
