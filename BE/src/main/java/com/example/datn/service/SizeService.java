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

        Size size = mapper.toSize(request);

        Size created = repository.save(size);

        return mapper.toSizeResponse(created);
    }

    public SizeResponse getSizeById(Integer id){

        Size size = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        return mapper.toSizeResponse(size);
    }

    public SizeResponse updateSize(Integer id, SizeRequest request){

        Size size = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        mapper.updateSize( size, request);

        return mapper.toSizeResponse(repository.save(size));
    }

    public void deleteSize(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Size id is not exists with given id: " + id));

        repository.deleteById(id);
    }
}
