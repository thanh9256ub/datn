package com.example.datn.repository;

import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail,Integer> {
    List<ProductDetail> findByProductId(Integer productId);

    @Query("SELECT COALESCE(SUM(pd.quantity), 0) FROM ProductDetail pd WHERE pd.product.id = :productId")
    Integer sumQuantityByProductId(@Param("productId") Integer productId);
}