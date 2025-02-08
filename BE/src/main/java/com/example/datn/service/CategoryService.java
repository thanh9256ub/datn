package com.example.datn.service;

import com.example.datn.dto.request.CategoryRequest;
import com.example.datn.dto.response.CategoryResponse;
import com.example.datn.entity.Category;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CategoryMapper;
import com.example.datn.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository repository;

    @Autowired
    CategoryMapper mapper;

    public List<CategoryResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public CategoryResponse createCategory(CategoryRequest request){

        Category category = mapper.toCategory(request);

        Category created = repository.save(category);

        return mapper.toCategoryResponse(created);
    }

    public CategoryResponse getCategoryById(Integer id){

        Category category = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category id is not exists with given id: " + id));

        return mapper.toCategoryResponse(category);
    }

    public CategoryResponse updateCategory(Integer id, CategoryRequest request){

        Category category = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category id is not exists with given id: " + id));

        mapper.updateCategory( category, request);

        return mapper.toCategoryResponse(repository.save(category));
    }

    public void deleteCategory(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category id is not exists with given id: " + id));

        repository.deleteById(id);
    }
}
