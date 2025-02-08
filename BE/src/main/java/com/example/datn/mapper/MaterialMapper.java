package com.example.datn.mapper;

import com.example.datn.dto.request.MaterialRequest;
import com.example.datn.dto.response.MaterialResponse;
import com.example.datn.entity.Material;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MaterialMapper {

    Material toMaterial(MaterialRequest request);

    MaterialResponse toMaterialResponse(Material material);

    List<MaterialResponse> toListResponse(List<Material> list);

    @Mapping(target = "id", ignore = true)
    void updateMaterial(@MappingTarget Material material, MaterialRequest request);

}
