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
@Table(name = "color")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "color_name")
    @NotBlank(message = "Color name is required")
    String colorName;

    @Column(name = "description")
    String description;
}
