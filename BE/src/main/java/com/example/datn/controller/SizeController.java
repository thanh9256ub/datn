package com.example.datn.controller;

import com.example.datn.dto.request.SizeRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.SizeResponse;
import com.example.datn.service.SizeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("size")
public class SizeController {

    @Autowired
    SizeService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<SizeResponse>> addSize(@Valid @RequestBody  SizeRequest request){

        SizeResponse sizeResponse = service.createSize(request);

        ApiResponse<SizeResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", sizeResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SizeResponse>>> getAll(){

        List<SizeResponse> list = service.getAll();

        ApiResponse<List<SizeResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Sizes retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeResponse> getOne(@PathVariable("id") Integer id){

        SizeResponse sizeResponse = service.getSizeById(id);

        return ResponseEntity.ok(sizeResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<SizeResponse>> updateSize(
                           @PathVariable("id") Integer id,
                           @Valid @RequestBody SizeRequest request){

        SizeResponse sizeResponse = service.updateSize(id, request);

        ApiResponse<SizeResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Size updated successfully",
                sizeResponse
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<SizeResponse>> deleteSize(@PathVariable("id") Integer id){

        service.deleteSize(id);

        ApiResponse<SizeResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Size deleted successfully",
                null
        );

        return ResponseEntity.ok(response);

    }
}
