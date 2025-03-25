package com.example.datn.controller;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("brand")
public class BrandController {

    @Autowired
    BrandService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<BrandResponse>> addBrand(@Valid @RequestBody  BrandRequest request){

        BrandResponse brandResponse = service.createBrand(request);

        ApiResponse<BrandResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", brandResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAll(){

        List<BrandResponse> list = service.getAll();

        ApiResponse<List<BrandResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Brands retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getOne(@PathVariable("id") Integer id){

        BrandResponse brandResponse = service.getBrandById(id);

        return ResponseEntity.ok(brandResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrand(
                           @PathVariable("id") Integer id,
                           @Valid @RequestBody BrandRequest request){

        BrandResponse brandResponse = service.updateBrand(id, request);

        ApiResponse<BrandResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Brand updated successfully",
                brandResponse
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> deleteBrand(@PathVariable("id") Integer id){

        service.deleteBrand(id);

        ApiResponse<BrandResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Brand deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}
