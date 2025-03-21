package com.example.datn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "[order]")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "order_code")
    String orderCode;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    Employee employee;

    @Column(name = "customer_name")
    String customerName;

    @Column(name = "phone")
    String phone;

    @Column(name = "address")
    String address;

    @Column(name = "note")
    String note;

    @Column(name = "shipping_fee")
    Double shippingFee;

    @Column(name = "discount_value")
    Double discountValue;

    @Column(name = "total_price")
    Double totalPrice;

    @Column(name = "total_payment")
    Double totalPayment;

    @ManyToOne
    @JoinColumn(name = "payment_type_id")
    PaymentType paymentType;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    PaymentMethod paymentMethod;

    @Column(name = "order_type")
    Integer orderType;

    @Column(name = "status")
    Integer status;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now().withNano(0);

    @Column(name = "updated_at")
    LocalDateTime updatedAt = null;

}
