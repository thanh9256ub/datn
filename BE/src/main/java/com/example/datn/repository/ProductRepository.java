package com.example.datn.repository;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {
    Product findByProductCode(String code);
}
