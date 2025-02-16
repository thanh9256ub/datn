package com.example.datn.dto.request;

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

    String fullName;

    String gender;

    @NotBlank(message = "Customer phone is unique")
    String phone;

    String email;

    String password;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Integer role_id;
}
