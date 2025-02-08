package com.example.datn.controller;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.service.ProductService;
import jakarta.validation.Valid;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("product")
public class ProductController {

    @Autowired
    ProductService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(@Valid @RequestBody ProductRequest request){

        ProductResponse productResponse = service.createProduct(request);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                productResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
