package com.example.datn.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AddressRequest {

    Integer id;

    String city;

    String district;

    String ward;

    String detailedAddress;

    @JsonProperty("customer_id")
    Integer customerId;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
