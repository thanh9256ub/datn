package com.example.datn.repository;

import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import com.example.datn.entity.Size;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail,Integer> {
    List<ProductDetail> findByProductId(Integer productId);

    List<ProductDetail> findByProductIdAndStatusNot(Integer productId, Integer status);

    List<ProductDetail> findByProductIdAndStatus(Integer productId, Integer status);


    List<ProductDetail> findByProductIdAndColorIdAndStatusNot(Integer productId, Integer colorId, Integer status);

    @Query("SELECT COALESCE(SUM(pd.quantity), 0) " +
            "FROM ProductDetail pd " +
            "WHERE pd.product.id = :productId " +
            "AND pd.status <> 2")
    Integer sumQuantityByProductId(@Param("productId") Integer productId);

    Optional<ProductDetail> findByProductAndColorAndSize(Product product, Color color, Size size);

    List<ProductDetail> findByProduct(Product product);

    List<ProductDetail> findByProductIdIn(List<Integer> productIds);

    @Query("SELECT pd FROM ProductDetail pd WHERE pd.id IN :ids AND pd.status = 1")
    List<ProductDetail> findByIdInAndStatus(@Param("ids") List<Integer> ids, @Param("status") Integer status);

    @Query("SELECT SUM(pd.quantity) FROM ProductDetail pd WHERE pd.product.id = :productId")
    Optional<Integer> sumQuantityByProduct(@Param("productId") Integer productId);

    @Query("SELECT pd FROM ProductDetail pd WHERE pd.product.id = :productId AND pd.color.id = :colorId AND pd.size.id = :sizeId")
    Optional<ProductDetail> findByProductColorAndSize(
            @Param("productId") Integer productId,
            @Param("colorId") Integer colorId,
            @Param("sizeId") Integer sizeId
    );

    Optional<ProductDetail> findByProduct_IdAndColor_IdAndSize_IdAndStatusNot(Integer pId, Integer colorId, Integer sizeId, Integer status);

    List<ProductDetail> findByStatusNot(Integer status);

    List<ProductDetail> findByStatus(Integer status);

    @Query("SELECT p FROM ProductDetail p WHERE p.product.id <> :id AND p.product.status <> 2")
    List<ProductDetail> findAllExceptId(@Param("id") Integer id);

    List<ProductDetail> findAll(Specification<ProductDetail> spec);
}
