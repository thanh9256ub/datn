package com.example.datn.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CustomerRequest {

    Integer id;

    String customerCode;

    String fullName;

    String gender;

    @NotBlank(message = "Customer phone is unique")
    String phone;

    String email;
    LocalDateTime createdAt;

    String password;


    LocalDateTime updatedAt;

    @JsonProperty("role_id")
    Integer roleId;
}
