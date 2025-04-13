package com.example.datn.controller;

import com.example.datn.dto.request.MaterialRequest;
import com.example.datn.dto.request.OrderHistoryRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.MaterialResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderHistoryResponse;
import com.example.datn.service.OrderHistoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("order-history")
public class OrderHistoryController {
    @Autowired
    OrderHistoryService service;
    @PostMapping("add")
    public ResponseEntity<ApiResponse<OrderHistoryResponse>> addMaterial(@Valid @RequestBody OrderHistoryRequest request){

        OrderHistoryResponse orderHistoryResponse = service.createOrderHistory(request);

        ApiResponse<OrderHistoryResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", orderHistoryResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderHistoryResponse>>> getAll(){

        List<OrderHistoryResponse> list = service.getAll();

        ApiResponse<List<OrderHistoryResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Materials retrieved successfully", list);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderHistoryResponse>> getOrdHistoryByOrderId(@PathVariable Integer orderId) {
        if (orderId == null) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
        List<OrderHistoryResponse> orderHistoryResponses = service.getListOrdHistoryByOrdId(orderId);
        return ResponseEntity.ok(orderHistoryResponses);
    }
}
