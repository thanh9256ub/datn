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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("product-color")
public class ProductColorController {

    @Autowired
    ProductColorService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<List<ProductColorResponse>>> createProductColor(
            @RequestBody ProductColorRequest request){

        List<ProductColorResponse> productColorResponse = service.createProductColor(request);

        ApiResponse<List<ProductColorResponse>> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created Successfully",
                productColorResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductColorResponse>>> getAll(){

        List<ProductColorResponse> listResponses = service.getAll();

        ApiResponse<List<ProductColorResponse>> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Successfully",
                listResponses
        );

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
                imageResponses
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("images")
    public ResponseEntity<ApiResponse<List<ImageResponse>>> getImages(){

        List<ImageResponse> listResponses = service.getImages();

        ApiResponse<List<ImageResponse>> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Successfully",
                listResponses
        );

        return ResponseEntity.ok(response);
    }
}
