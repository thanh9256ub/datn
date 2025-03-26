package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AddressRequest {

    String city;

    String district;

    String ward;

    String detailedAddress;

    Integer customerId;

    Integer status;

    Boolean defaultAddress;
}