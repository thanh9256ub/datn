package com.example.datn.mapper;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "material", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(target = "brandName", source = "brand.brandName")
    @Mapping(target = "categoryName", source = "category.categoryName")
    @Mapping(target = "materialName", source = "material.materialName")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toListProduct(List<Product> list);

    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
