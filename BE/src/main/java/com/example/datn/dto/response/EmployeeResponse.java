package com.example.datn.dto.response;

import com.example.datn.entity.Employee;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EmployeeResponse {

    Integer id;

    String employeeCode;

    String fullName;

    Integer gender;

    String birthDate;

    String phone;

    String address;

    String email;

    String username;

    Integer roleId;

    String createdAt;

    String updatedAt;

    Integer status;

    String image;

    public EmployeeResponse(Employee employee) {
        this.id = employee.getId();
        this.employeeCode = employee.getEmployeeCode();
        this.fullName = employee.getFullName();
        this.gender = employee.getGender();
        if (Objects.nonNull(employee.getBirthDate()))
            this.birthDate = employee.getBirthDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.phone = employee.getPhone();
        this.address = employee.getAddress();
        this.email = employee.getEmail();
        this.username = employee.getUsername();
        this.roleId = Objects.isNull(employee.getRole()) ? 0 : employee.getRole().getId();
        this.createdAt = employee.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.updatedAt = Objects.isNull(employee.getUpdatedAt())
                ? employee.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : employee.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.status = employee.getStatus();
        this.image = Objects.toString(employee.getImage());
    }

}
