package com.example.datn.repository;

import com.example.datn.entity.CartDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartDetailsRepository extends JpaRepository<CartDetails,Long> {
    List<CartDetails> findByCartId(Integer cartId);
    @Query("SELECT cd FROM CartDetails cd WHERE cd.cart.id = :cartId AND cd.productDetail.id = :productDetailId")
    Optional<CartDetails> findByCartIdAndProductDetailId(
            @Param("cartId") Integer cartId,
            @Param("productDetailId") Integer productDetailId);
}
