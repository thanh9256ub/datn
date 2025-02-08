package com.example.datn.repository;

import com.example.datn.dto.response.BrandResponse;
import com.example.datn.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand,Integer> {
//    @Query("""
//        SELECT new com.example.datn.dto.response.BrandResponse(
//            b.id,
//            b.brandCode,
//            b.brandName,
//            b.description
//        ) FROM Brand b
//    """)
//    List<BrandResponse> getAllResponse();
}
