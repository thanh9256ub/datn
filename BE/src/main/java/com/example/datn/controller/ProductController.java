package com.example.datn.controller;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("products")
public class ProductController {

    @Autowired
    ProductService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(
            @Valid @RequestBody ProductRequest request) {

        ProductResponse productResponse = service.createProduct(request);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                productResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {

        List<ProductResponse> list = service.getAll();

        ApiResponse<List<ProductResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Products retrieved successfully",
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable("id") Integer id){

        ProductResponse productResponse = service.getById(id);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Successfully",
                productResponse
        );

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @Valid @RequestBody ProductRequest request,
            @PathVariable("id") Integer id) {

        ProductResponse productResponse = service.updateProduct(id, request);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Product updated successfully",
                productResponse
        );

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> deleteProduct(@PathVariable("id") Integer id) {

        service.deleteProduct(id);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Product deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(
            @PathVariable("productId") Integer productId,
            @RequestParam("status") Integer status) {

        ProductResponse productResponse = service.updateStatus(productId, status);

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Update status successfully",
                productResponse
        );

        return ResponseEntity.ok(response);
    }


}
