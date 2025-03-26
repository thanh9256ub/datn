package com.example.datn.mapper;

import com.example.datn.dto.response.ImageResponse;
import com.example.datn.dto.response.ProductColorResponse;
import com.example.datn.entity.Image;
import com.example.datn.entity.ProductColor;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductColorMapper {

    List<ProductColorResponse> toListResponse(List<ProductColor> list);

    List<ImageResponse> toListImageResponse(List<Image> list);

}