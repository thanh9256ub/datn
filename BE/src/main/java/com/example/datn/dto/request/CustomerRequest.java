package com.example.datn.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CustomerRequest {

    Integer id;

    String customerCode;

    String fullName;

    String birthDate;

    Integer gender;

    String phone;

    String email;

//    LocalDateTime createdAt;

    String password;

//    LocalDateTime updatedAt;

    Integer roleId;

    Integer status;

    List<AddressRequest> address;
}