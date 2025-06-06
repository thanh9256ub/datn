package com.example.datn.controller;

import com.example.datn.dto.request.ImageRequest;
import com.example.datn.dto.request.ProductColorRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ImageResponse;
import com.example.datn.dto.response.ProductColorResponse;
import com.example.datn.service.ProductColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("product-color")
public class ProductColorController {

        @Autowired
        ProductColorService service;

        @PostMapping("add")
        public ResponseEntity<ApiResponse<List<ProductColorResponse>>> createProductColor(
                        @RequestBody ProductColorRequest request) {

                List<ProductColorResponse> productColorResponse = service.createProductColor(request);

                ApiResponse<List<ProductColorResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Created Successfully",
                                productColorResponse);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<ProductColorResponse>>> getAll() {

                List<ProductColorResponse> listResponses = service.getAll();

                ApiResponse<List<ProductColorResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Successfully",
                                listResponses);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/add-images/{productColorId}")
        public ResponseEntity<ApiResponse<List<ImageResponse>>> addImagesToProductColor(
                        @PathVariable Integer productColorId,
                        @RequestBody List<ImageRequest> imageRequests) {

                List<ImageResponse> imageResponses = service.addImagesToProductColor(productColorId, imageRequests);

                ApiResponse<List<ImageResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Images added successfully",
                                imageResponses);

                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @GetMapping("images")
        public ResponseEntity<ApiResponse<List<ImageResponse>>> getImages() {

                List<ImageResponse> listResponses = service.getImages();

                ApiResponse<List<ImageResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Successfully",
                                listResponses);

                return ResponseEntity.ok(response);
        }

        @GetMapping("{productId}")
        public ResponseEntity<ApiResponse<List<ProductColorResponse>>> getProductColorsByProduct(
                        @PathVariable("productId") Integer productId) {

                List<ProductColorResponse> listResponses = service.getProductColorsByProduct(productId);

                ApiResponse<List<ProductColorResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Successfully",
                                listResponses);

                return ResponseEntity.ok(response);
        }

        @GetMapping("{productColorId}/images")
        public ResponseEntity<ApiResponse<List<ImageResponse>>> getImagesByProductColor(
                        @PathVariable("productColorId") Integer productColorId) {

                List<ImageResponse> listResponses = service.getImagesByProductColor(productColorId);

                ApiResponse<List<ImageResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Successfully",
                                listResponses);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/update-images/{productColorId}")
        public ResponseEntity<ApiResponse<List<ImageResponse>>> updateImagesForProductColor(
                        @PathVariable("productColorId") Integer productColorId,
                        @RequestBody List<ImageRequest> newImageRequests) {
                List<ImageResponse> updatedImages = service.updateImagesForProductColor(productColorId,
                                newImageRequests);

                ApiResponse<List<ImageResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Successfully",
                                updatedImages);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/by-products")
        public ResponseEntity<ApiResponse<Map<Integer, List<ProductColorResponse>>>> getProductColorsByProductList(
                @RequestParam("productIds") List<Integer> productIds) {

                Map<Integer, List<ProductColorResponse>> responseMap = service.getProductColorsByProductList(productIds);

                ApiResponse<Map<Integer, List<ProductColorResponse>>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Successfully",
                        responseMap);

                return ResponseEntity.ok(response);
        }
}