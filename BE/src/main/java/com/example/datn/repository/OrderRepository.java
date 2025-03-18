package com.example.datn.repository;

import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    @Query("SELECT o FROM Order o  ORDER BY o.createdAt DESC")
    List<Order> getAll();
    @Query("SELECT o FROM Order o WHERE " +
            "(:orderCode IS NULL OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :orderCode, '%'))) " +
            "AND (:minPrice IS NULL OR o.totalPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR o.totalPrice <= :maxPrice) " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "AND (:status IS NULL OR o.status = :status) " +
            "ORDER BY o.createdAt DESC")
    List<Order> filterOrders(@Param("orderCode") String orderCode,
                             @Param("minPrice") Double minPrice,
                             @Param("maxPrice") Double maxPrice,
                             @Param("startDate") LocalDateTime startDate,
                             @Param("endDate") LocalDateTime endDate,
                             @Param("status") Integer status);
}
