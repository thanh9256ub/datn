package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationCustomerResponse {

    String token;

    boolean authenticated;

    String email;

    Integer customerId;

    String fullName;

    String role;

    String image;
}
