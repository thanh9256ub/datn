package com.example.datn.repository;

import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail,Integer> {
    List<ProductDetail> findByProduct(Product product);
}
