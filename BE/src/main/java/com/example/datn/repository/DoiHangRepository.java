package com.example.datn.repository;

import com.example.datn.entity.DoiHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoiHangRepository extends JpaRepository<DoiHang,Integer> {
}