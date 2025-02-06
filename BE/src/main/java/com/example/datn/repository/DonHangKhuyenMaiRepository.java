package com.example.datn.repository;

import com.example.datn.entity.DonHangKhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonHangKhuyenMaiRepository extends JpaRepository<DonHangKhuyenMai,Integer> {
}
