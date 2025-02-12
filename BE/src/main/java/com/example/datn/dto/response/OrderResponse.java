package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Integer id;
    String orderCode;

    Integer customer_id;

    Integer employee_id;

    String customerName;

    String phone;

    String address;

    String note;

    Double shippingFee;

    Double discountValue;

    Double totalPrice;

    Double totalPayment;

    String paymentTypeName;

    String paymentMethodName;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
