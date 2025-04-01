package com.example.datn.repository;

import com.example.datn.entity.ProductUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductUpdateRepository extends JpaRepository<ProductUpdate, Integer> {
    @Query("SELECT pu FROM ProductUpdate pu ORDER BY pu.updatedAt DESC")
    List<ProductUpdate> findLatestUpdates();
}
