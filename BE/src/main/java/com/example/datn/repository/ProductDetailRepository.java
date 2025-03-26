package com.example.datn.repository;

import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import com.example.datn.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail,Integer> {
    List<ProductDetail> findByProductId(Integer productId);

    @Query("SELECT COALESCE(SUM(pd.quantity), 0) FROM ProductDetail pd WHERE pd.product.id = :productId")
    Integer sumQuantityByProductId(@Param("productId") Integer productId);

    Optional<ProductDetail> findByProductAndColorAndSize(Product product, Color color, Size size);

    List<ProductDetail> findByProduct(Product product);
}
