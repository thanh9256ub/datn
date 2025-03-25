package com.example.datn.dto.response;

import com.example.datn.entity.Cart;
import com.example.datn.entity.ProductDetail;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartDetailsResponse {
    Integer id;
    Cart cart;
    ProductDetail productDetail;
    Integer quantity;
    Double price;
    Double total_price;
    LocalDateTime created_at;
    LocalDateTime updated_at;
}
