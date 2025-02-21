package com.example.datn.dto.response;

import com.example.datn.entity.Employee;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EmployeeResponse {

    Integer id;

    String employeeCode;

    String fullName;

    String gender;

    String birthDate;

    String phone;

    String address;

    String email;

    String username;

    @JsonProperty("role_id")
    Integer roleId;

    String createdAt;

    Integer status;

    public EmployeeResponse(Employee employee) {
        this.id = employee.getId();
        this.employeeCode = employee.getEmployeeCode();
        this.fullName = employee.getFullName();
        this.gender = employee.getGender();
        this.birthDate = employee.getBirthDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.phone = employee.getPhone();
        this.address = employee.getAddress();
        this.email = employee.getEmail();
        this.username = employee.getUsername();
        this.roleId = employee.getRoLe().getId();
        this.createdAt = employee.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.status = employee.getStatus();
    }
}
