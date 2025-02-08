package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "category")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "category_code")
    String categoryCode;

    @Column(name = "category_name")
    String categoryName;

    @Column(name = "decsription")
    String description;
}
