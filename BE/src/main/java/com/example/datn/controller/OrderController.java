package com.example.datn.controller;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.request.PaymentMethodRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.dto.response.PaymentMethodResponse;
import com.example.datn.entity.Order;
import com.example.datn.service.DonHangService;
import com.example.datn.service.OrderService;
import com.example.datn.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("order")

public class OrderController {
    @Autowired
    OrderService service;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<OrderResponse>> add(
            @RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = service.create(orderRequest);
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", orderResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAll(){
        List<OrderResponse>list=service.getAll();
        ApiResponse<List<OrderResponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOne(@PathVariable("id") Integer id){
        OrderResponse orderResponse=service.getById(id);
        return ResponseEntity.ok(orderResponse);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> update(
            @PathVariable("id") Integer id,@RequestBody OrderRequest orderRequest){
        OrderResponse orderResponse=service.update(id,orderRequest);
        ApiResponse<OrderResponse>apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod updated successfully",orderResponse);
        return  ResponseEntity.ok(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> delete(@PathVariable("id") Integer id){
        service.detele(id);
        ApiResponse<OrderResponse> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod deleted successfully",null);
        return ResponseEntity.ok(apiResponse);
    }

}
