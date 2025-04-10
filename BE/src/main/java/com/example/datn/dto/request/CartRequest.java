package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
    Integer id;

    Integer customerId;

    Double total_price;

    LocalDateTime created_at;

    Integer status;

    public CartRequest(Integer customerId, Double total_price, LocalDateTime created_at, Integer status) {
    }
}
