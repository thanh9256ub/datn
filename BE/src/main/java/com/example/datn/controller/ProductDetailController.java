package com.example.datn.controller;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product-detail")
public class ProductDetailController {

    @Autowired
    ProductDetailService service;

    @PostMapping("add-multiple/{productId}")
    public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> addProductDetail(
            @PathVariable("productId") Integer productId,
            @RequestBody List<ProductDetailRequest> requests){

        List<ProductDetailResponse> listResponse = service.createProductDetails(productId, requests);

        ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Product detail created successfully",
                listResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
