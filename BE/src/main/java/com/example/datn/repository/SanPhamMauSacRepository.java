package com.example.datn.repository;

import com.example.datn.entity.ProductColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamMauSacRepository extends JpaRepository<ProductColor,Integer> {
}
