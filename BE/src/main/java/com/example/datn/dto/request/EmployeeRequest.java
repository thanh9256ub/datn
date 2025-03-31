package com.example.datn.dto.request;

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

    String employeeCode;

    String fullName;

    Integer gender;

    LocalDate birthDate;

    String phone;

    String address;

    String email;

    String username;

    String password;

    Integer roleId;

    String createdAt;

    String updatedAt;

    Integer status;

    String image;
}