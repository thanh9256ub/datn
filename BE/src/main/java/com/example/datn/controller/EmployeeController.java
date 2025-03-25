package com.example.datn.controller;

import com.example.datn.dto.request.AuthenticationRequest;
import com.example.datn.dto.request.EmployeeRequest;
import com.example.datn.dto.response.ApiPagingResponse;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.EmployeeResponse;
import com.example.datn.repository.EmployeeRepository;
import com.example.datn.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("employee")
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @Autowired
    EmployeeRepository employeeRepository;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<EmployeeResponse>> addEmployee(@Valid @RequestBody EmployeeRequest employeeRequest) {

        EmployeeResponse employeeResponse = employeeService.createEmployee(employeeRequest);

        ApiResponse<EmployeeResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                employeeResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiPagingResponse<List<EmployeeResponse>>> getAll(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "page", defaultValue = "1") Integer page) {
        int pageSize = 5;
        ApiPagingResponse<List<EmployeeResponse>> response =
                employeeService.getAll(search, status, page, pageSize);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getOne(@PathVariable("id") Integer id) {

        EmployeeResponse employeeResponse = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employeeResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @PathVariable("id") Integer id, @RequestBody EmployeeRequest employeeRequest) {

        EmployeeResponse employeeResponse = employeeService.updateEmployee(id, employeeRequest);

        ApiResponse<EmployeeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee updated successfully",
                employeeResponse
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> delete(@PathVariable("id") Integer id) {

        employeeService.deleteEmployee(id);

        ApiResponse<EmployeeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/updateEmployeeStatus/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployeeStatus(@PathVariable("id") Integer id) {
        EmployeeResponse employeeResponse = employeeService.updateEmployeeStatus(id);

        ApiResponse<EmployeeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee updated successfully",
                employeeResponse
        );

        return ResponseEntity.ok(apiResponse);
    }
}
