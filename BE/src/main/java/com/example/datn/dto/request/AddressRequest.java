package com.example.datn.dto.request;

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

    Integer customerId;

    Integer status;

    Boolean defaultAddress;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}