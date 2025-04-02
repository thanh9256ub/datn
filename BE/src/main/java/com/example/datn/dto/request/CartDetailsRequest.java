package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartDetailsRequest {
    Long id;
    Integer cartId;
    Integer productDetailId;
    Integer quantity;
    Double price;
    Double total_price;
    LocalDateTime created_at;
    LocalDateTime updated_at;
}
