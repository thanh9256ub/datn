package com.example.datn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    Order order;

    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    ProductDetail productDetail;

    @Column(name = "quantity")
    Integer quantity;

    @Column(name = "price")
    Double price;

    @Column(name = "total_price")
    Double totalPrice;

    @Column(name = "status")
    Integer status;

    @Column(name = "product_status")
    Integer productStatus;


}
