package com.example.datn.mapper;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.entity.Brand;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandRequest request);

    BrandResponse toBrandResponse(Brand brand);

    List<BrandResponse> toListResponse(List<Brand> list);

}
