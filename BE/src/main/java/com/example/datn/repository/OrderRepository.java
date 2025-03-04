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
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.paymentType LEFT JOIN FETCH o.paymentMethod")
    List<Order> findAllWithPaymentDetails();
}
