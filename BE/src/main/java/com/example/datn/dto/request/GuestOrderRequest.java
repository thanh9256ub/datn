package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GuestOrderRequest {
    String customerName;
    String phone;
    String address;
    String note;
    Double shippingFee;
    Double discountValue;
    Double totalPrice;
    Double totalPayment;
    Integer paymentMethodId;
    Integer paymentTypeId;
    Integer orderType;
    Integer status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CartItemDTO> cartItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDTO {
        Integer productDetailId;
        Integer quantity;
        Double price;
        Double total_price;
    }
}
