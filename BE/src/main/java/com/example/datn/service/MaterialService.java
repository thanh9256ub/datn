package com.example.datn.service;

import com.example.datn.dto.request.MaterialRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.dto.response.MaterialResponse;
import com.example.datn.entity.Material;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.MaterialMapper;
import com.example.datn.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    @Autowired
    MaterialRepository repository;

    @Autowired
    MaterialMapper mapper;

    public List<MaterialResponse> getAll() {
        return mapper.toListResponse(repository.findAll());
    }

    public List<MaterialResponse> getActive(){
        return mapper.toListResponse(repository.findByStatus(1));
    }


    public MaterialResponse createMaterial(MaterialRequest request) {

        Material brand = mapper.toMaterial(request);

        Material created = repository.save(brand);

        return mapper.toMaterialResponse(created);
    }

    public MaterialResponse getMaterialById(Integer id) {

        Material brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        return mapper.toMaterialResponse(brand);
    }

    public MaterialResponse updateMaterial(Integer id, MaterialRequest request) {

        Material brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        mapper.updateMaterial(brand, request);

        return mapper.toMaterialResponse(repository.save(brand));
    }

    public MaterialResponse updateStatus(Integer id){
        Material brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        brand.setStatus(brand.getStatus() == 1 ? 0 : 1);

        return mapper.toMaterialResponse(repository.save(brand));
    }
}