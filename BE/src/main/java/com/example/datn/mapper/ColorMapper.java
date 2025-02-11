package com.example.datn.mapper;

import com.example.datn.dto.request.ColorRequest;
import com.example.datn.dto.response.ColorResponse;
import com.example.datn.entity.Color;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    Color toColor(ColorRequest request);

    ColorResponse toColorResponse(Color color);

    List<ColorResponse> toListResponse(List<Color> list);

    @Mapping(target = "id", ignore = true)
    void updateColor(@MappingTarget Color color, ColorRequest request);

}
