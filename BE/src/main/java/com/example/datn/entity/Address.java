package com.example.datn.entity;

import com.example.datn.dto.request.AddressRequest;
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

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;

    @Column(name = "status")
    private Integer status;

    @Column(name = "default_address")
    private Boolean defaultAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Address(AddressRequest addressRequest, Customer customer) {
        this.city = addressRequest.getCity();
        this.district = addressRequest.getDistrict();
        this.ward = addressRequest.getWard();
        this.detailedAddress = addressRequest.getDetailedAddress();
        this.defaultAddress = addressRequest.getDefaultAddress();
        this.customer = customer;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = 1;
    }

}

