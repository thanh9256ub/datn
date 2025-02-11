package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String employee_code;

    private String full_name;

    private String gender;

    private LocalDate birth_date;

    private String phone;

    private String address;

    private String email;

    private String username;

    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoLe roLe;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private Integer status;


}
