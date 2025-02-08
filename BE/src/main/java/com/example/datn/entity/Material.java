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
@Table(name = "material")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "material_code")
    String materialCode;

    @Column(name = "material_name")
    String materialName;

    @Column(name = "description")
    String description;
}
