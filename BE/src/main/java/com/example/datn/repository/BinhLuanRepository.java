package com.example.datn.repository;

import com.example.datn.entity.BinhLuan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinhLuanRepository extends JpaRepository<BinhLuan,Integer> {
}