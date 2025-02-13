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

    Integer customerId;

    Integer employeeId;

    String customerName;

    String phone;

    String address;

    String note;

    Double shippingFee;

    Double discountValue;

    Double totalPrice;

    Double totalPayment;

    String paymentTypeNameId;

    String paymentMethodNameId;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
