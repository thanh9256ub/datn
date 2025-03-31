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
    public ApiResponse<AuthenticationCustomerResponse> authenticate(@RequestBody AuthencaticationCustomerRequest authencaticationCustomerRequest) throws AuthenticationException {

        var result = authenticationCustomerService.authenticationResponse(authencaticationCustomerRequest);

        return ApiResponse.<AuthenticationCustomerResponse>builder()
                .data(result)
                .build();
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
