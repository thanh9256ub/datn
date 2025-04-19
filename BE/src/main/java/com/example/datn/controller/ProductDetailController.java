package com.example.datn.controller;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Size;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        
        @GetMapping("/sizes-by-color/{productId}/{colorId}")
        public ResponseEntity<ApiResponse<List<Size>>> getSizesByProductAndColor(
                @PathVariable("productId") Integer productId,
                @PathVariable("colorId") Integer colorId) {

                List<Size> sizes = service.getSizesByProductIdAndColor(productId, colorId);

                ApiResponse<List<Size>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Sizes retrieved successfully",
                        sizes
                );

                return ResponseEntity.ok(response);
        }

        @GetMapping("/find-by-attributes")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> getDetailByAttributes(
                @RequestParam(value = "productId", required = false) Integer productId,
                @RequestParam(value = "colorId", required = false) Integer colorId,
                @RequestParam(value = "sizeId", required = false) Integer sizeId) {

                ProductDetailResponse response = service.getDetailByAttributes(productId, colorId, sizeId);

                ApiResponse<ProductDetailResponse> apiResponse = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Product detail retrieved successfully",
                        response
                );

                return ResponseEntity.ok(apiResponse);
        }

        @PatchMapping("/update-status/{id}")
        public ResponseEntity<ProductDetailResponse> deleteAndRestoreProductDetail(@PathVariable("id") Integer pdId){
                ProductDetailResponse productDetailResponse = service.deleteAndRestoreProductDetail(pdId);
                return ResponseEntity.ok(productDetailResponse);
        }

        @PostMapping("/check-stock")
        public ResponseEntity<ApiResponse<Map<Integer, Integer>>> checkStockAvailability(
                @RequestBody List<Map<String, Integer>> checkStockRequests) {

                if (checkStockRequests == null || checkStockRequests.isEmpty()) {
                        throw new IllegalArgumentException("Danh sách kiểm tra tồn kho không được trống");
                }

                for (Map<String, Integer> request : checkStockRequests) {
                        if (request.get("productDetailId") == null) {
                                throw new IllegalArgumentException("Thiếu productDetailId trong request");
                        }
                }

                Map<Integer, Integer> stockAvailability = service.checkStockAvailability(checkStockRequests);

                ApiResponse<Map<Integer, Integer>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Stock availability checked successfully",
                        stockAvailability
                );
                return ResponseEntity.ok(response);
        }

        @GetMapping("{id}/related")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getRelatedProducts(
                @PathVariable("id") Integer productId) {

                List<ProductDetailResponse> productDetails = service.getRelatedProducts(productId);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        200,
                        "List product detail related by id: " + productId,
                        productDetails);

                return ResponseEntity.ok(response);
        }
        @GetMapping("/search-ai")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> searchProductAI(
                @RequestParam(value = "name", required = false) String name) {

                List<ProductDetailResponse> list = service.searchProductDetailAI(name);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        200,
                        "Products retrieved successfully",
                        list);

                return ResponseEntity.ok(response);
        }
}