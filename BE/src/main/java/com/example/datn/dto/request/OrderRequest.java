package com.example.datn.dto.request;

import com.example.datn.entity.Customer;
import com.example.datn.entity.PaymentType;
import com.example.datn.entity.Employee;
import com.example.datn.entity.PaymentMethod;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class OrderRequest {


    String orderCode;

    Integer  customer_id;

    Integer employee_id;

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

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
