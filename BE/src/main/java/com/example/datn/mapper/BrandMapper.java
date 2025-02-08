package com.example.datn.mapper;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.entity.Brand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandRequest request);

    BrandResponse toBrandResponse(Brand brand);

    List<BrandResponse> toListResponse(List<Brand> list);

    @Mapping(target = "id", ignore = true)
    void updateBrand(@MappingTarget Brand brand, BrandRequest request);

}
