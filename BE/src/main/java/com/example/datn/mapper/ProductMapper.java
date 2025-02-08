package com.example.datn.mapper;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toListProduct(List<Product> list);

    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
