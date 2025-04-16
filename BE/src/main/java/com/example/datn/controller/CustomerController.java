package com.example.datn.controller;

import com.example.datn.dto.request.ChangePasswordRequest;
import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.request.ForgotPasswordRequest;
import com.example.datn.dto.response.ApiPagingResponse;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.service.AuthenticationCustomerService;
import com.example.datn.service.CustomerService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.sasl.AuthenticationException;
import java.text.ParseException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("customer")

public class CustomerController {

    @Autowired
    CustomerService customerService;

    @Autowired
    AuthenticationCustomerService authenticationCustomerService;

    @PostMapping("addFast")
    public ResponseEntity<ApiResponse<CustomerResponse>> addCustomerFast(@Valid @RequestBody CustomerRequest customerRequest) {

        CustomerResponse customerResponse = customerService.creatCustomerFast(customerRequest);

        ApiResponse<CustomerResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                customerResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("add")
    public ResponseEntity<ApiResponse<CustomerResponse>> addCustomer(@Valid @RequestBody CustomerRequest customerRequest) {

        CustomerResponse customerResponse = customerService.creatCustomer(customerRequest);
        ApiResponse<CustomerResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                customerResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping
    public ResponseEntity<ApiPagingResponse<List<CustomerResponse>>> getAll(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") Integer page) {

        int pageSize = 5;

        ApiPagingResponse<List<CustomerResponse>> response = customerService.getAll(search, page, pageSize);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAll() {

        List<CustomerResponse> list = customerService.getList();

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

    @PostMapping("/change-password-customer")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody ChangePasswordRequest changePasswordRequest)
            throws AuthenticationException, ParseException, JOSEException {
        String token = (StringUtils.isNotBlank(bearerToken) && bearerToken.startsWith("Bearer "))
                ? bearerToken.substring(7)
                : StringUtils.EMPTY;
        if (StringUtils.isBlank(token))
            throw new AuthenticationException("Authentication failed");
        return authenticationCustomerService.changePassword(token, changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
    }

    @PostMapping("/forgot-password-customer")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        return authenticationCustomerService.forgotPassword(forgotPasswordRequest.getEmail());
    }
}