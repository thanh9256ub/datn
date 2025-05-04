package com.example.datn.repository;

import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Brand;
import com.example.datn.entity.Category;
import com.example.datn.entity.Material;
import com.example.datn.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

//    @Query("SELECT p.id, p.totalQuantity FROM Product p")
//    List<Object[]> getAllProductQuantities();

    Page<Product> findAll(Pageable pageable);

    Optional<Product> findByProductNameAndBrandAndCategoryAndMaterial(String productName, Brand brand, Category category, Material material);
    @Query(value = "SELECT TOP 5 " +
            "product_name, total_quantity " +
            "FROM product " +
            "WHERE [status] != 2 " +
            "ORDER BY total_quantity ASC", nativeQuery = true)
    List<Object[]> findTop5ProductsWithLowestQuantity();

    @Query("SELECT DISTINCT p FROM OrderDetail od " +
            "JOIN od.productDetail pd " +
            "JOIN pd.product p " +
            "JOIN od.order o " +
            "WHERE o.status = 5")
    List<Product> findDistinctProductsFromCompletedOrders();
}