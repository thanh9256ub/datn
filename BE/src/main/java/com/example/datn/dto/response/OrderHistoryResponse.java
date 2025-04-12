package com.example.datn.dto.response;

import com.example.datn.entity.Order;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderHistoryResponse {
    Integer id;
    Order order;
    String icon;
    String description;
    LocalDateTime change_time;
}
