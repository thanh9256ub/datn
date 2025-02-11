package com.example.datn.service;

import com.example.datn.dto.request.SizeRequest;
import com.example.datn.dto.response.SizeResponse;
import com.example.datn.entity.Size;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.SizeMapper;
import com.example.datn.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService {

    @Autowired
    SizeRepository repository;

    @Autowired
    SizeMapper mapper;

    public List<SizeResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public SizeResponse createSize(SizeRequest request){

        Size brand = mapper.toSize(request);

        Size created = repository.save(brand);

        return mapper.toSizeResponse(created);
    }

    public SizeResponse getSizeById(Integer id){

        Size brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        return mapper.toSizeResponse(brand);
    }

    public SizeResponse updateSize(Integer id, SizeRequest request){

        Size brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        mapper.updateSize( brand, request);

        return mapper.toSizeResponse(repository.save(brand));
    }

    public void deleteSize(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        repository.deleteById(id);
    }
}
