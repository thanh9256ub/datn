package com.example.datn.controller;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.request.OrderVoucherRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.dto.response.OrderVoucherReponse;
import com.example.datn.service.OrderVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("order-voucher")
public class OrderVoucherController {
    @Autowired
    OrderVoucherService service;
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<OrderVoucherReponse>> add(
            @RequestBody OrderVoucherRequest orderRequest) {
        OrderVoucherReponse orderResponse = service.create(orderRequest);
        ApiResponse<OrderVoucherReponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", orderResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderVoucherReponse>>> getAll(){
        List<OrderVoucherReponse>list=service.getAll();
        ApiResponse<List<OrderVoucherReponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }
}
