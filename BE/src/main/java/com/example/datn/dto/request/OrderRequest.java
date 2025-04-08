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
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {

    String orderCode;

    Integer  customerId;

    Integer employeeId;

    String customerName;

    String phone;

    String address;

    String note;

    Double shippingFee;

    Double discountValue;

    Double totalPrice;

    Double totalPayment;

    Integer paymentTypeId;

    Integer paymentMethodId;

    Integer orderType;

    Integer status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
    List<CartItemDTO> cartItems; // Thêm danh sách sản phẩm

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CartItemDTO {
        Integer productDetailId;
        Integer quantity;
        Double price;
        Double totalPrice; // Sửa từ total_price thành totalPrice để đồng nhất với naming convention
    }
}
