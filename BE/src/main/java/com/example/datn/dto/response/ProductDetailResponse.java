package com.example.datn.dto.response;

import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.Size;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailResponse {

    Integer id;

    Product product;

    Color color;

    Size size;

    Double price;

    Integer quantity;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    String qr;
}
