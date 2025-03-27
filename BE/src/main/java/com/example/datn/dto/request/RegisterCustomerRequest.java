package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterCustomerRequest {
    String email;

    String fullName;

    String phone;

    Integer gender;

    LocalDate birthDate;
}
