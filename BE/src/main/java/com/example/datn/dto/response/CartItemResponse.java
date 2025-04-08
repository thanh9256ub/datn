package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
     Integer id;
     String productName;
     String color;
     String size;
     Integer quantity;
     Double price;
     Double totalPrice;
}
