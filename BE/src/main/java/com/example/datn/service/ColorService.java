package com.example.datn.service;

import com.example.datn.dto.request.ColorRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.dto.response.ColorResponse;
import com.example.datn.entity.Color;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ColorMapper;
import com.example.datn.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService {

    @Autowired
    ColorRepository repository;

    @Autowired
    ColorMapper mapper;

    public List<ColorResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public List<ColorResponse> getActive(){
        return mapper.toListResponse(repository.findByStatus(1));
    }


    public ColorResponse createColor(ColorRequest request){

        Color color = mapper.toColor(request);

        Color created = repository.save(color);

        return mapper.toColorResponse(created);
    }

    public ColorResponse getColorById(Integer id){

        Color color = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Color id is not exists with given id: " + id));

        return mapper.toColorResponse(color);
    }

    public ColorResponse updateColor(Integer id, ColorRequest request){

        Color color = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Color id is not exists with given id: " + id));

        mapper.updateColor( color, request);

        return mapper.toColorResponse(repository.save(color));
    }

    public ColorResponse updateStatus(Integer id){
        Color brand = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        brand.setStatus(brand.getStatus() == 1 ? 0 : 1);

        return mapper.toColorResponse(repository.save(brand));
    }
}