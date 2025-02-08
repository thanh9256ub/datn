package com.example.datn.service;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.entity.Brand;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.BrandMapper;
import com.example.datn.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    BrandRepository repository;

    @Autowired
    BrandMapper mapper;

    public List<BrandResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public BrandResponse createBrand(BrandRequest request){

        Brand brand = mapper.toBrand(request);

        return mapper.toBrandResponse(repository.save(brand));
    }

    public BrandResponse getBrandById(Integer id){

        Brand brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        return mapper.toBrandResponse(brand);
    }

    public BrandResponse updateBrand(Integer id, BrandRequest request){

        Brand brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        mapper.updateBrand( brand, request);

        return mapper.toBrandResponse(repository.save(brand));
    }

    public void deleteBrand(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        repository.deleteById(id);
    }
}
