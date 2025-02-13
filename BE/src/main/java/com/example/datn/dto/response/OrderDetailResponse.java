package com.example.datn.dto.response;

import com.example.datn.entity.Order;
import com.example.datn.entity.ProductDetail;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {

    Integer id;


    Integer orderId;


    Integer productDetailId;


    Integer quantity;


    Double price;


    Double totalPrice;


    Integer status;


    Integer productStatus;
}
