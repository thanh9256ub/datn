package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
            @Column(name = "id")
    Integer id;

    @OneToOne
    @JoinColumn(name = "customer_id")
    Customer customer;

    @Column(name = "total_price")
    Double total_price;

    @Column(name = "created_at")
    LocalDateTime created_at;

    @Column(name = "status")
    Integer status;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartDetails> items = new ArrayList<>();
    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        this.total_price = items.stream()
                .mapToDouble(CartDetails::getTotal_price)
                .sum();}
}
