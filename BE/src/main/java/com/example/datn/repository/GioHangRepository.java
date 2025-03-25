package com.example.datn.repository;

import com.example.datn.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GioHangRepository extends JpaRepository<Cart,Integer> {
}