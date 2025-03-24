package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CartDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    ProductDetail productDetail;

    @Column(name = "quantity")
    Integer quantity;

    @Column(name = "price")
    Double price;

    @Column(name = "total_price")
    Double total_price;

    @Column(name = "created_at")
    LocalDateTime created_at;

    @Column(name = "updated_at")
    LocalDateTime updated_at;

}
