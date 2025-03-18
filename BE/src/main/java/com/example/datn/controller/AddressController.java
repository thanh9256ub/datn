package com.example.datn.controller;

import com.example.datn.dto.request.AddressRequest;
import com.example.datn.dto.response.AddressResponse;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("address")
public class AddressController {

    @Autowired
    AddressService addressService;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(@Valid @RequestBody AddressRequest addressRequest) {

        AddressResponse addressResponse = addressService.creaAddress(addressRequest);

        ApiResponse<AddressResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                addressResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAll() {

        List<AddressResponse> list = addressService.getAll();

        ApiResponse<List<AddressResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Address retrieved successfully",
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getOne(@PathVariable("id") Integer id) {

        AddressResponse addressResponse = addressService.getAddressById(id);
        return ResponseEntity.ok(addressResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> update(
            @PathVariable("id") Integer id, @RequestBody AddressRequest addressRequest) {

        AddressResponse addressResponse = addressService.updateAddress(id, addressRequest);

        ApiResponse<AddressResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Address updated successfully",
                addressResponse
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> delete(@PathVariable("id") Integer id) {

        addressService.deleteAddress(id);

        ApiResponse<AddressResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Address deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}