package com.example.datn.repository;

import com.example.datn.entity.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichSuDonHangRepository extends JpaRepository<OrderHistory,Integer> {
}
