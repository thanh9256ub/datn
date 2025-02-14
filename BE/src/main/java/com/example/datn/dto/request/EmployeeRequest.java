package com.example.datn.dto.request;

import com.example.datn.entity.Role;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    Integer role_id;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Integer status;
}
