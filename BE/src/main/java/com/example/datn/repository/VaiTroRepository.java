package com.example.datn.repository;

import com.example.datn.entity.RoLe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaiTroRepository extends JpaRepository<RoLe,Integer> {
}
