package com.example.datn.service;

import com.example.datn.dto.request.AuthenticationRequest;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.repository.EmployeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    @Autowired
    EmployeeRepository employeeRepository;

    public boolean authentication(AuthenticationRequest authenticationRequest) {

        var employee = employeeRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow(
                () -> new ResourceNotFoundException("Employee not existed.")
        );

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        return passwordEncoder.matches(authenticationRequest.getPassword(), employee.getPassword());
    }
}
