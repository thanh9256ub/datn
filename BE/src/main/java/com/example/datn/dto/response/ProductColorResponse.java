package com.example.datn.dto.response;

import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductColorResponse {

    Integer id;

    Product product;

    Color color;

    String description;

}
