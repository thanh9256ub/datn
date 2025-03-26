package com.example.datn.mapper;

import com.example.datn.dto.request.CategoryRequest;
import com.example.datn.dto.response.CategoryResponse;
import com.example.datn.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toListResponse(List<Category> list);

    @Mapping(target = "id", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryRequest request);

}