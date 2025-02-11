package com.example.datn.mapper;

import com.example.datn.dto.request.SizeRequest;
import com.example.datn.dto.response.SizeResponse;
import com.example.datn.entity.Size;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SizeMapper {

    Size toSize(SizeRequest request);

    SizeResponse toSizeResponse(Size size);

    List<SizeResponse> toListResponse(List<Size> list);

    @Mapping(target = "id", ignore = true)
    void updateSize(@MappingTarget Size size, SizeRequest request);

}
