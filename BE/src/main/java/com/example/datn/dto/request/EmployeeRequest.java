package com.example.datn.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRequest {

    Integer id;

    @NotBlank(message = "Employee code is required")
    String employeeCode;

    String fullName;

    String gender;

    LocalDate birthDate;

    String phone;

    String address;

    String email;

    String userName;

    String passWord;

    @JsonProperty("role_id")
    Integer roleId;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Integer status;
}
