package com.example.datn.repository;

import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
//    List<Product> findByStatus(Integer status);
    Page<Product> findAll(Pageable pageable);
}