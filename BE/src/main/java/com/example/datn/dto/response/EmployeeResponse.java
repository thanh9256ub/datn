package com.example.datn.dto.response;

import com.example.datn.entity.Role;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EmployeeResponse {

    Integer id;

    String employeeCode;

    String fullName;

    String gender;

    LocalDate birthDate;

    String phone;

    String address;

    String email;

    String userName;

    String passWord;

    Integer role_id;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Integer status;
}
