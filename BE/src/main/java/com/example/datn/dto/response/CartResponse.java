package com.example.datn.dto.response;

import com.example.datn.entity.Customer;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    Integer id;
    Customer customer;
    Double total_price;
    LocalDateTime create_at;
    Integer status;
}
