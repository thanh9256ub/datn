package com.example.datn.controller;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("product-detail")
public class ProductDetailController {

    @Autowired
    ProductDetailService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> addProductDetail(@RequestBody ProductDetailRequest request){

        ProductDetailResponse productDetailResponse = service.createProductDetail(request);

        ApiResponse<ProductDetailResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Product detail created successfully",
                productDetailResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
