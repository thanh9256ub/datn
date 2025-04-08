package com.example.datn.controller;

import com.example.datn.dto.request.ColorRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ColorResponse;
import com.example.datn.dto.response.ColorResponse;
import com.example.datn.dto.response.ColorResponse;
import com.example.datn.service.ColorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("color")
public class ColorController {

    @Autowired
    ColorService service;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<ColorResponse>> addColor(@Valid @RequestBody  ColorRequest request){

        ColorResponse colorResponse = service.createColor(request);

        ApiResponse<ColorResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", colorResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ColorResponse>>> getAll(){

        List<ColorResponse> list = service.getAll();

        ApiResponse<List<ColorResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Colors retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ColorResponse>>> getActive(){

        List<ColorResponse> list = service.getActive();

        ApiResponse<List<ColorResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Colors retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColorResponse> getOne(@PathVariable("id") Integer id){

        ColorResponse colorResponse = service.getColorById(id);

        return ResponseEntity.ok(colorResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<ColorResponse>> updateColor(
                           @PathVariable("id") Integer id,
                           @Valid @RequestBody ColorRequest request){

        ColorResponse colorResponse = service.updateColor(id, request);

        ApiResponse<ColorResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Color updated successfully",
                colorResponse
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping ("/update-status/{id}")
    public ResponseEntity<ApiResponse<ColorResponse>> updateStatus(@PathVariable("id") Integer id){

        ColorResponse brandResponse = service.updateStatus(id);

        ApiResponse<ColorResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Updated status successfully",
                brandResponse
        );

        return ResponseEntity.ok(response);
    }
}
