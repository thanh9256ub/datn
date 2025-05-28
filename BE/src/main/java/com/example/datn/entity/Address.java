package com.example.datn.entity;

import com.example.datn.dto.request.AddressRequest;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "address")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "detailed_address")
    private String detailedAddress;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;

    @Column(name = "status")
    private Integer status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Address(AddressRequest addressRequest, Customer customer) {
        this.city = addressRequest.getCity();
        this.district = addressRequest.getDistrict();
        this.ward = addressRequest.getWard();
        this.detailedAddress = addressRequest.getDetailedAddress();
        this.customer = customer;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (addressRequest.getDefaultAddress() != null) {
            this.status = addressRequest.getDefaultAddress() ? 1 : 0;
        } else {
            this.status = addressRequest.getStatus() != null ? addressRequest.getStatus() : 0;
        }
    }
}

