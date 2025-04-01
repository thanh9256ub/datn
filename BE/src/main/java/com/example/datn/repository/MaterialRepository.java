package com.example.datn.repository;

import com.example.datn.entity.Brand;
import com.example.datn.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material,Integer> {

    Optional<Material> findByMaterialName(String materialName);

    List<Material> findByStatus(Integer status);

}