package com.example.datn.controller;

import com.example.datn.dto.request.AuthencaticationCustomerRequest;
import com.example.datn.dto.request.RegisterCustomerRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.AuthenticationCustomerResponse;
import com.example.datn.dto.response.CustomerProfileResponse;
import com.example.datn.service.AuthenticationCustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.sasl.AuthenticationException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("authCustomer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthencaticationCustomerController {

    @Autowired
    AuthenticationCustomerService authenticationCustomerService;

    @PostMapping("token")
    public ResponseEntity<ApiResponse<AuthenticationCustomerResponse>> authenticate(
            @RequestBody AuthencaticationCustomerRequest authencaticationCustomerRequest) {
        try {
            var result = authenticationCustomerService.authenticationResponse(authencaticationCustomerRequest);
            ApiResponse<AuthenticationCustomerResponse> response = ApiResponse.<AuthenticationCustomerResponse>builder()
                    .status(HttpStatus.OK.value()) // 200
                    .message("Đăng nhập thành công")
                    .data(result)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AuthenticationException e) {
            ApiResponse<AuthenticationCustomerResponse> errorResponse = ApiResponse.<AuthenticationCustomerResponse>builder()
                    .status(HttpStatus.UNAUTHORIZED.value()) // 401
                    .message(e.getMessage()) // "Customer not existed" hoặc "Unauthenticated"
                    .data(null)
                    .build();
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("register")
    public ApiResponse<Object> register(@RequestBody RegisterCustomerRequest registerCustomerRequest) {

        return authenticationCustomerService.register(registerCustomerRequest);
    }
    @GetMapping("profile")
    public ApiResponse<CustomerProfileResponse> getProfile(@RequestHeader("Authorization") String authorizationHeader) throws AuthenticationException {
        String token = authorizationHeader.replace("Bearer ", ""); // Loại bỏ "Bearer " từ header
        var result = authenticationCustomerService.getCustomerProfile(token);
        return ApiResponse.<CustomerProfileResponse>builder()
                .data(result)
                .build();
    }
}
