package com.example.datn.controller;

import com.example.datn.dto.request.AuthenticationRequest;
import com.example.datn.dto.request.IntrospectRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.AuthenticationResponse;
import com.example.datn.dto.response.IntrospectResponse;
import com.example.datn.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.KeyLengthException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthenticationController {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("token")
     public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {

        var result = authenticationService.authentication(authenticationRequest);

        return ApiResponse.<AuthenticationResponse>builder()
                .data(result)
                .build();
    }

    @PostMapping("introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {

        var result = authenticationService.introspect(introspectRequest);
        return ApiResponse.<IntrospectResponse>builder()
                .data(result)
                .build();
    }
}
