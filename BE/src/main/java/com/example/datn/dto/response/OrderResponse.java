package com.example.datn.dto.response;

import com.example.datn.entity.Customer;
import com.example.datn.entity.Employee;
import com.example.datn.entity.PaymentMethod;
import com.example.datn.entity.PaymentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {

    Integer id;

    String orderCode;

    Customer customer;

    Employee employee;

    String customerName;

    String phone;

    String address;

    String note;

    Double shippingFee;

    Double discountValue;

    Double totalPrice;

    Double totalPayment;

    PaymentType paymentType;

    PaymentMethod paymentMethod;

    Integer orderType;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
