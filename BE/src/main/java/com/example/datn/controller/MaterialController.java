package com.example.datn.controller;

import com.example.datn.dto.request.MaterialRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.MaterialResponse;
import com.example.datn.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("material")
public class MaterialController {

    @Autowired
    MaterialService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<MaterialResponse>> addMaterial(@Valid @RequestBody  MaterialRequest request){

        MaterialResponse materialResponse = service.createMaterial(request);

        ApiResponse<MaterialResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", materialResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getAll(){

        List<MaterialResponse> list = service.getAll();

        ApiResponse<List<MaterialResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Materials retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> getOne(@PathVariable("id") Integer id){

        MaterialResponse materialResponse = service.getMaterialById(id);

        return ResponseEntity.ok(materialResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<MaterialResponse>> updateMaterial(
                           @PathVariable("id") Integer id,
                           @Valid @RequestBody MaterialRequest request){

        MaterialResponse materialResponse = service.updateMaterial(id, request);

        ApiResponse<MaterialResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Material updated successfully",
                materialResponse
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<MaterialResponse>> deleteMaterial(@PathVariable("id") Integer id){

        service.deleteMaterial(id);

        ApiResponse<MaterialResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Material deleted successfully",
                null
        );

        return ResponseEntity.ok(response);

    }
}
