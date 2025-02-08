package com.example.datn.service;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.entity.Brand;
import com.example.datn.mapper.BrandMapper;
import com.example.datn.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    BrandRepository repository;

    BrandMapper mapper;

    public List<BrandResponse> getAll(){
        return repository.getAllResponse();
    }

    public Brand createBrand(BrandRequest request){

        Brand brand = mapper.toBrand(request);

        return repository.save(brand);
    }
}
