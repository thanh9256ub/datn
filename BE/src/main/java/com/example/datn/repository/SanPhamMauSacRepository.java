package com.example.datn.repository;

import com.example.datn.entity.SanPhamMauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamMauSacRepository extends JpaRepository<SanPhamMauSac,Integer> {
}
