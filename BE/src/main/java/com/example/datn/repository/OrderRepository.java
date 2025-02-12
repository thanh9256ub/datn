package com.example.datn.repository;

import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    @Query("""
            SELECT new com.example.datn.dto.response.OrderResponse(
            o.id,
            o.orderCode,
            o.customer.id,
            o.employee.id,
            o.customerName,
            o.phone,
            o.address,
            o.note,
            o.shippingFee,
             o.discountValue,
            o.totalPrice,
            o.totalPayment,
            o.paymentType.paymentTypeName,
            o.paymentMethod.paymentMethodName,
            o.status,
            o.createdAt,
            o.updatedAt
            ) FROM  Order o
            """)
    List<OrderResponse> getAll();
    @Query("""
            SELECT new com.example.datn.dto.response.OrderResponse(
            o.id,
            o.orderCode,
            o.customer.id,
            o.employee.id,
            o.customerName,
            o.phone,
            o.address,
            o.note,
            o.shippingFee,
             o.discountValue,
            o.totalPrice,
            o.totalPayment,
            o.paymentType.paymentTypeName,
            o.paymentMethod.paymentMethodName,
            o.status,
            o.createdAt,
            o.updatedAt
            ) FROM  Order o
            """)
    List<OrderResponse> getAll(Pageable pageable);
}
