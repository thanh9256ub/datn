package com.example.datn.dto.response;

import com.example.datn.entity.Address;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AddressResponse {

    Integer id;

    String city;

    String district;

    String ward;

    @JsonProperty("detailed_address")
    String detailedAddress;

    @JsonProperty("customer_id")
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
        this.customerId = address.getCustomer().getId();
        this.status = address.getStatus();
        this.createdAt = address.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.updatedAt = address.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
