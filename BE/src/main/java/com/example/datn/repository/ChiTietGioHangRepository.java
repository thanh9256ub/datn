package com.example.datn.repository;

import com.example.datn.entity.CartDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietGioHangRepository extends JpaRepository<CartDetails,Integer> {
}
