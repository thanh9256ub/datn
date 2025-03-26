package com.example.datn.repository;

import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductColorRepository extends JpaRepository<ProductColor,Integer> {

    List<ProductColor> findByProductId(Integer productId);

    Optional<ProductColor> findByProductAndColor(Product product, Color color);

}