package com.example.datn.dto.response;

import com.example.datn.entity.Customer;
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
public class CartResponse {
    Integer id;
    Customer customer;
    Double total_price;
    LocalDateTime create_at;
    Integer status;
}
