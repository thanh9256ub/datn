package com.example.datn.dto.response;

import com.example.datn.entity.Employee;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    String userName;

    String passWord;

    @JsonProperty("role_id")
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
        this.birthDate = employee.getBirthDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.phone = employee.getPhone();
        this.address = employee.getAddress();
        this.email = employee.getEmail();
        this.userName = employee.getEmail();
        this.passWord = employee.getPassWord();
        this.roleId = employee.getRoLe().getId();
        this.createdAt = employee.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.updatedAt = employee.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.status = employee.getStatus();
        this.image = Objects.toString(employee.getImage());
    }
}
