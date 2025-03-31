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
     List<ProductDetail> findByProductIdAndColorId(Integer productId, Integer colorId);
    @Query("SELECT COALESCE(SUM(pd.quantity), 0) FROM ProductDetail pd WHERE pd.product.id = :productId")
    Integer sumQuantityByProductId(@Param("productId") Integer productId);

    Optional<ProductDetail> findByProductAndColorAndSize(Product product, Color color, Size size);

    List<ProductDetail> findByProduct(Product product);

    @Query("SELECT SUM(pd.quantity) FROM ProductDetail pd WHERE pd.product.id = :productId")
    Optional<Integer> sumQuantityByProduct(@Param("productId") Integer productId);
    @Query("SELECT pd FROM ProductDetail pd WHERE pd.product.id = :productId AND pd.color.id = :colorId AND pd.size.id = :sizeId")
    Optional<ProductDetail> findByProductColorAndSize(
            @Param("productId") Integer productId,
            @Param("colorId") Integer colorId,
            @Param("sizeId") Integer sizeId
    );

}
