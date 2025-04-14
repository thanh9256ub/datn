package com.example.datn.repository;

import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.OrderHistory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory,Integer> {
    @Query("SELECT od FROM OrderHistory od WHERE od.order.id = :orderId")
    List<OrderHistory> findByOrderId(@Param("orderId") int orderId);
    List<OrderHistory> findByOrderId(Integer orderId, Sort sort);
}
