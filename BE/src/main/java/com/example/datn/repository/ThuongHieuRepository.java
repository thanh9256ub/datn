package com.example.datn.repository;

import com.example.datn.dto.response.ThuongHieuResponse;
import com.example.datn.entity.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThuongHieuRepository extends JpaRepository<ThuongHieu,Integer> {
    @Query("""
        SELECT new com.example.datn.dto.response.ThuongHieuResponse(
            th.id,
            th.maThuongHieu,
            th.tenThuongHieu,
            th.moTa
        ) FROM ThuongHieu th
    """)
    List<ThuongHieuResponse> getAllResponse();
}
