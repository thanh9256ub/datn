package com.example.datn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "product_code")
    @NotBlank(message = "Product code is required")
    String productCode;

    @Column(name = "product_name")
    @NotBlank(message = "Product name is required")
    String productName;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    @NotNull(message = "Brand ID is required")
    Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "Category ID is required")
    Category category;

    @ManyToOne
    @JoinColumn(name = "material_id")
    @NotNull(message = "Material ID is required")
    Material material;

    @Column(name = "main_image")
    @NotBlank(message = "Main image is required")
    String mainImage;

    @Column(name = "total_quantity")
    Integer totalQuantity;

    @Column(name = "status")
    Integer status;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now().withNano(0);

    @Column(name = "updated_at")
    LocalDateTime updatedAt = null;

}
