package com.example.datn.repository;

import com.example.datn.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image,Integer> {
    List<Image> findByProductColorId(Integer productColorId);
    void deleteByProductColorId(Integer productColorId);
}