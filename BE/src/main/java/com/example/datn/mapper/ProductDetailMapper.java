package com.example.datn.mapper;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.entity.ProductDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductDetailMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)

    ProductDetail toProductDetail(ProductDetailRequest request);

    ProductDetailResponse toProductDetailResponse(ProductDetail productDetail);

    List<ProductDetailResponse> toListProductDetail(List<ProductDetail> list);

    void updateProductDetail(@MappingTarget ProductDetail productDetail, ProductDetailRequest request);
}
