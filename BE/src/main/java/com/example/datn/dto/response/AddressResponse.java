package com.example.datn.dto.response;

import com.example.datn.entity.Address;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AddressResponse {


    Integer id;

    String city;

    String district;

    String ward;

    String detailedAddress;

    Boolean defaultAddress;

    Integer customerId;

    Integer status;

    String createdAt;

    String updatedAt;

    public AddressResponse(Address address) {
        this.id = address.getId();
        this.city = address.getCity();
        this.district = address.getDistrict();
        this.ward = address.getWard();
        this.detailedAddress = address.getDetailedAddress();
        this.customerId = Objects.isNull(address.getCustomer()) ? 0 : address.getCustomer().getId();
        this.status = address.getStatus();
        this.defaultAddress = address.getStatus() == 1;
        this.createdAt = address.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.updatedAt = address.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}