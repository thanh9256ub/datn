package com.example.datn.controller;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/product-detail")
public class ProductDetailController {

        @Autowired
        ProductDetailService service;

        @PostMapping("/add-multiple/{productId}")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> addProductDetail(
                        @PathVariable("productId") Integer productId,
                        @RequestBody List<ProductDetailRequest> requests) {

                List<ProductDetailResponse> listResponse = service.createProductDetails(productId, requests);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Product detail created successfully",
                                listResponse);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getAll() {

                List<ProductDetailResponse> responseList = service.getAll();

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Retrieved successfully",
                                responseList);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{productId}")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getProductDetailsByProductId(
                        @PathVariable("productId") Integer productId) {

                List<ProductDetailResponse> productDetails = service.getProductDetailsByProductId(productId);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                200,
                                "List product detail by id: " + productId,
                                productDetails);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{pdId}")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProductDetail(
                        @PathVariable("pdId") Integer pdId,
                        @RequestBody ProductDetailRequest request) {

                ProductDetailResponse productDetailResponse = service.updateProductDetail(pdId, request);

                ApiResponse<ProductDetailResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                productDetailResponse);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{productId}/update-list")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> updateProductDetails(
                        @PathVariable Integer productId,
                        @RequestBody List<ProductDetailRequest> requests) {

                List<ProductDetailResponse> list = service.updateProductDetails(productId, requests);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                list);

                return ResponseEntity.ok(response);
        }

        @PatchMapping("/{pdId}/update-qr")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> updateQR(
                        @PathVariable("pdId") Integer pdId) {

                ProductDetailResponse productDetailResponse = service.updateQR(pdId);

                ApiResponse<ProductDetailResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                productDetailResponse);

                return ResponseEntity.ok(response);
        }

}