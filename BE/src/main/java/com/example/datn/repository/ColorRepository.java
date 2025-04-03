package com.example.datn.repository;

import com.example.datn.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color,Integer> {

    Optional<Color> findByColorName(String colorName);

    List<Color> findByStatus(Integer status);
}