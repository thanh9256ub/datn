package com.example.datn.dto.response;

import com.example.datn.entity.Customer;
import com.example.datn.entity.Role;
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
public class CustomerResponse {

    Integer id;

    String customerCode;

    String fullName;

    String gender;

    String phone;

    String email;

    String password;

    String createdAt;

    String updatedAt;

    @JsonProperty("role_id")
    Integer roleId;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.customerCode = customer.getCustomerCode();
        this.fullName = customer.getFullName();
        this.gender = customer.getGender();
        this.phone = customer.getPhone();
        this.email = customer.getEmail();
        this.password = customer.getPassword();
        this.createdAt = customer.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.updatedAt = customer.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.roleId = customer.getRoLe().getId();
    }
}
