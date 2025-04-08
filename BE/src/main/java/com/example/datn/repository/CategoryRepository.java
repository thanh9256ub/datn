package com.example.datn.repository;

import com.example.datn.entity.Brand;
import com.example.datn.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer> {

    Optional<Category> findByCategoryName(String categoryName);

    List<Category> findByStatus(Integer status);
}