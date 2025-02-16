package com.example.datn.dto.response;

import com.example.datn.entity.Role;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {

    Integer id;

    String fullName;

    String gender;

    String phone;

    String email;

    String password;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Integer role_id;
}
