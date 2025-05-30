package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {

    String token;

    boolean authenticated;

    Integer idEmployee;

    String fullName;

    String role;
    String image;

}