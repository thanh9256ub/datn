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
    @Mapping(target = "productCode", ignore = true)
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toListProductResponse(List<Product> list);

    @Mapping(target = "productCode", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
