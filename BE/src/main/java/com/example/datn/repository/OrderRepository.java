package com.example.datn.repository;

import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.paymentType LEFT JOIN FETCH o.paymentMethod")
    List<Order> findAllWithPaymentDetails();

    @Query("SELECT o FROM Order o  ORDER BY o.createdAt DESC")
    List<Order> getAll();

    @Query("SELECT o FROM Order o WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(o.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:minPrice IS NULL OR " +
            "(o.totalPrice + COALESCE(o.shippingFee, 0) - COALESCE(o.discountValue, 0)) >= :minPrice) " +
            "AND (:maxPrice IS NULL OR " +
            "(o.totalPrice + COALESCE(o.shippingFee, 0) - COALESCE(o.discountValue, 0)) <= :maxPrice) " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "AND (:status IS NULL OR o.status = :status) " +
            "AND o.status <> 0 " +
            "ORDER BY o.updatedAt DESC")
    List<Order> filterOrders(@Param("search") String search,
                             @Param("minPrice") Double minPrice,
                             @Param("maxPrice") Double maxPrice,
                             @Param("startDate") LocalDateTime startDate,
                             @Param("endDate") LocalDateTime endDate,
                             @Param("status") Integer status);

    @Query("SELECT " +
            "(SELECT COUNT(o) FROM Order o WHERE o.orderType = 0 AND o.paymentType.id = 1 AND o.status = 5), " +
            "(SELECT COUNT(o) FROM Order o WHERE o.orderType = 0 AND o.paymentType.id = 2 AND o.status = 5), " +
            "(SELECT COUNT(o) FROM Order o WHERE o.orderType = 1 AND o.status = 5)" +
            "FROM Order o")
    Object[] getOrderSellCounts();

    @Query("SELECT " +
            "(SELECT COUNT(o) FROM Order o WHERE o.status = 5) AS completedOrders, " +  // Đếm đơn hàng đã hoàn thành
            "(SELECT COUNT(o) FROM Order o WHERE o.status = 6) AS canceledOrders " +    // Đếm đơn hàng đã hủy
            "FROM Order o")
    Object[] getOrderCounts();

    @Query(value = "SELECT MONTH(updated_at) AS month, COUNT(*) AS order_count " +
            "FROM [order] WHERE status = 5 AND YEAR(updated_at) = :year " +
            "GROUP BY MONTH(updated_at) ORDER BY month", nativeQuery = true)
    List<Object[]> findOrdersByMonthInNative(Integer year);

    @Query(value = "SELECT DAY(updated_at) AS day, COUNT(*) AS order_count " +
            "FROM [order] WHERE status = 5 AND YEAR(updated_at) = :year " +
            "AND MONTH(updated_at) = :month " +
            "GROUP BY DAY(updated_at) ORDER BY day", nativeQuery = true)
    List<Object[]> findOrdersByDayInJanuaryNative(Integer month, Integer year);


    @Query(value = "SELECT DAY(updated_at) AS day, SUM(total_price) AS revenue " +
            "FROM [order] " +
            "WHERE status = 5 " +
            "AND YEAR(updated_at) = :year " +
            "AND MONTH(updated_at) = :month " +
            "GROUP BY DAY(updated_at) " +
            "ORDER BY day", nativeQuery = true)
    List<Object[]> findRevenueByDayInMarch(Integer month, Integer year);

    @Query(value = "SELECT MONTH(updated_at) AS month, SUM(total_price) AS revenue " +
            "FROM [order] " +
            "WHERE status = 5 " +
            "AND YEAR(updated_at) = :year " +
            "GROUP BY MONTH(updated_at) " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> findRevenueByMonthIn2025(Integer year);

    @Query(value = "SELECT " +
            "SUM(total_payment - discount_value) AS total_revenue, " +
            "SUM(CASE WHEN order_type = 0 THEN total_payment - discount_value ELSE 0 END) AS off_revenue, " +
            "SUM(CASE WHEN order_type = 1 THEN total_payment - discount_value ELSE 0 END) AS on_revenue " +
            "FROM [order] " +
            "WHERE status = 5 " +
            "AND YEAR(updated_at) = :year", nativeQuery = true)
    Object[] findRevenueByYear(@Param("year") Integer year);

    @Query(value = "SELECT " +
            "SUM(total_payment - discount_value) AS total_revenue, " +
            "SUM(CASE WHEN order_type = 0 THEN total_payment - discount_value ELSE 0 END) AS off_revenue, " +
            "SUM(CASE WHEN order_type = 1 THEN total_payment - discount_value ELSE 0 END) AS on_revenue " +
            "FROM [order] " +
            "WHERE status = 5 " +
            "AND YEAR(updated_at) = :year " +
            "AND MONTH(updated_at) = :month", nativeQuery = true)
    Object[] findRevenueByMonth(@Param("year") Integer year, @Param("month") Integer month);

    @Query(value = "SELECT " +
            "SUM(total_payment - discount_value) AS total_revenue, " +
            "SUM(CASE WHEN order_type = 0 THEN total_payment - discount_value ELSE 0 END) AS off_revenue, " +
            "SUM(CASE WHEN order_type = 1 THEN total_payment - discount_value ELSE 0 END) AS on_revenue " +
            "FROM [order] " +
            "WHERE status = 5 " +
            "AND updated_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    Object[] findRevenueBetweenDates(@Param("startDate") String startDate,
                                     @Param("endDate") String endDate);


    @Query(value = "SELECT " +
            "SUM(total_payment - discount_value) AS total_revenue, " +
            "SUM(CASE WHEN order_type = 0 THEN total_payment - discount_value ELSE 0 END) AS off_revenue, " +
            "SUM(CASE WHEN order_type = 1 THEN total_payment - discount_value ELSE 0 END) AS on_revenue " +
            "FROM [order] " +
            "WHERE status = 5 ", nativeQuery = true)
    Object[] findRevenueTotal();

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByStatusAndCreatedAtBefore(Integer status, LocalDateTime yesterday);

    @Query(value = "SELECT COUNT(*) FROM [order] WHERE [status] = 5 AND CONVERT(DATE, updated_at) = CONVERT(DATE, GETDATE())", nativeQuery = true)
    int countOrdersWithStatus5Today();

    @Query(value = "SELECT COUNT(*) FROM [order] WHERE [status] = 2  AND CONVERT(DATE, updated_at) = CONVERT(DATE, GETDATE())", nativeQuery = true)
    int countOrdersWithStatus2Today();

    @Query(value = "SELECT SUM(od.quantity) " +
            "FROM order_detail od " +
            "JOIN [order] o ON od.order_id = o.id " +
            "WHERE o.[status] = 5 " +
            "AND CONVERT(DATE, o.updated_at) = CONVERT(DATE, GETDATE())",
            nativeQuery = true)
    Integer getTotalQuantityOfTodayOrdersWithStatus5();

    @Query(value = "SELECT SUM(total_price - shipping_fee) " +
            "FROM [order] " +
            "WHERE [status] = 5 " +
            "AND CONVERT(DATE, updated_at) = CONVERT(DATE, GETDATE())",
            nativeQuery = true)
    BigDecimal getTotalNetPriceOfTodayOrdersWithStatus5();


    List<Order> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);
}