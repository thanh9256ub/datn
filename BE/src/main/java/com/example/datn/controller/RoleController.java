package com.example.datn.controller;

import com.example.datn.dto.request.RoleRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.RoleResponse;
import com.example.datn.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("role")
public class RoleController {

    @Autowired
    RoleService roleService;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<RoleResponse>> addRole(@Valid @RequestBody RoleRequest roleRequest) {

        RoleResponse roleResponse = roleService.createRole(roleRequest);

        ApiResponse<RoleResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Created successfully",
                roleResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAll() {

        List<RoleResponse> list = roleService.getAll();

        ApiResponse<List<RoleResponse>> roLeResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Role retrieved successfully",
                list
        );

        return ResponseEntity.ok(roLeResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getOne(@PathVariable("id") Integer id) {

        RoleResponse roleResponse = roleService.getRoleById(id);

        return ResponseEntity.ok(roleResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> update(
            @PathVariable("id") Integer id, @RequestBody RoleRequest roleRequest
    ) {
        RoleResponse roleResponse = roleService.updateRole(id, roleRequest);

        ApiResponse<RoleResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Role updated successfully",
                roleResponse
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> delete(@PathVariable("id") Integer id) {

        roleService.deleteRole(id);

        ApiResponse<RoleResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Role updated successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
