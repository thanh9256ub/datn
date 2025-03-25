package com.example.datn.controller;

import com.example.datn.dto.request.CategoryRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CategoryResponse;
import com.example.datn.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("category")
public class CategoryController {

    @Autowired
    CategoryService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<CategoryResponse>> addCategory(@Valid @RequestBody  CategoryRequest request){

        CategoryResponse categoryResponse = service.createCategory(request);

        ApiResponse<CategoryResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", categoryResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll(){

        List<CategoryResponse> list = service.getAll();

        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Categorys retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getOne(@PathVariable("id") Integer id){

        CategoryResponse categoryResponse = service.getCategoryById(id);

        return ResponseEntity.ok(categoryResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
                           @PathVariable("id") Integer id,
                           @Valid @RequestBody CategoryRequest request){

        CategoryResponse categoryResponse = service.updateCategory(id, request);

        ApiResponse<CategoryResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Category updated successfully",
                categoryResponse
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> deleteCategory(@PathVariable("id") Integer id){

        service.deleteCategory(id);

        ApiResponse<CategoryResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Category deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}
