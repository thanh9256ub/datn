package com.example.datn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "size")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "size_name")
    @NotBlank(message = "Size name id required")
    String sizeName;

    @Column(name = "status")
    Integer status;

    @Column(name = "description")
    String description;
}