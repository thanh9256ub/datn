package com.example.datn.controller;

import com.example.datn.dto.request.EmployeeRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.EmployeeResponse;
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
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll() {

        List<EmployeeResponse> list = employeeService.getAll();

        ApiResponse<List<EmployeeResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee retrieved successfully",
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getOne(@PathVariable("id") Integer id){

        EmployeeResponse employeeResponse = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employeeResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @PathVariable("id") Integer id, @RequestBody EmployeeRequest employeeRequest){

        EmployeeResponse employeeResponse = employeeService.updateEmployee(id,employeeRequest);

        ApiResponse<EmployeeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee updated successfully",
                employeeResponse
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> delete(@PathVariable("id") Integer id){

        employeeService.deleteEmployee(id);

        ApiResponse<EmployeeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Employee deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
