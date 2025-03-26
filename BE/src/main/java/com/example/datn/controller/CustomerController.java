package com.example.datn.controller;

import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("customer")

public class CustomerController {

    @Autowired
    CustomerService customerService;

    @PostMapping("addT")
    public ResponseEntity<ApiResponse<CustomerResponse>> addCustomerT(@Valid @RequestBody CustomerRequest customerRequest) {

        CustomerResponse customerResponse = customerService.creatCustomerT(customerRequest);

        ApiResponse<CustomerResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                customerResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAll() {

        List<CustomerResponse> list = customerService.getAll();

        ApiResponse<List<CustomerResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Customer retrieved successfully",
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getOne(@PathVariable("id") Integer id) {

        CustomerResponse customerResponse = customerService.getCustomerById(id);

        return ResponseEntity.ok(customerResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @PathVariable("id") Integer id, @RequestBody CustomerRequest customerRequest
    ) {
        CustomerResponse customerResponse = customerService.updateCustomer(id, customerRequest);

        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Customer updated successfully",
                customerResponse
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> delete(@PathVariable("id") Integer id) {

        customerService.deleteCustomer(id);

        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Customer updated successfully",
                null
        );
        return ResponseEntity.ok(apiResponse);
    }
}
