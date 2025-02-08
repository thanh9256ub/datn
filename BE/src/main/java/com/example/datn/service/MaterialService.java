package com.example.datn.service;

import com.example.datn.dto.request.MaterialRequest;
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

    public List<MaterialResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public MaterialResponse createMaterial(MaterialRequest request){

        Material material = mapper.toMaterial(request);

        Material created = repository.save(material);

        return mapper.toMaterialResponse(created);
    }

    public MaterialResponse getMaterialById(Integer id){

        Material material = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        return mapper.toMaterialResponse(material);
    }

    public MaterialResponse updateMaterial(Integer id, MaterialRequest request){

        Material material = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        mapper.updateMaterial( material, request);

        return mapper.toMaterialResponse(repository.save(material));
    }

    public void deleteMaterial(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        repository.deleteById(id);
    }
}
