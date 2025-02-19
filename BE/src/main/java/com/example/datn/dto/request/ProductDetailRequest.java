package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailRequest {

    Integer productId;

    Integer colorId;

    Integer sizeId;

    Double price;

    Integer quantity;

    Integer status;

    String qr;
}
