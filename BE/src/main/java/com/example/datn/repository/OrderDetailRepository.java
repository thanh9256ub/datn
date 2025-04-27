package com.example.datn.repository;

import com.example.datn.entity.OrderDetail;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Integer> {
    //Optional<OrderDetail> findByOrderId(Integer orderId);
    @Query("SELECT od FROM OrderDetail od WHERE od.order.id = :orderId")
    List<OrderDetail> findByOrderId(@Param("orderId") int orderId);
    @Query("SELECT p.productName, SUM(od.quantity) " +
            "FROM OrderDetail od " +
            "JOIN od.order o " +
            "JOIN od.productDetail pd " +
            "JOIN pd.product p " +
            "WHERE o.status = 5 " +
            "GROUP BY p.productName " +
            "ORDER BY SUM(od.quantity) DESC")
    List<Object[]> getTop5BestSellingProducts(Pageable pageable);
    @Modifying
    @Query("DELETE FROM OrderDetail od WHERE od.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") int orderId);

}