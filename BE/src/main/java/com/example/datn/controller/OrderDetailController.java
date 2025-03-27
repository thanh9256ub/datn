package com.example.datn.controller;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.service.OrderDetailService;
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
@RequestMapping("order-detail")
public class OrderDetailController {
    @Autowired
    private OrderDetailService service;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> add(
            @RequestBody OrderDetailRequest orderRequest) {
        OrderDetailResponse orderResponse = service.create(orderRequest);
        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", orderResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> getAll(){
        List<OrderDetailResponse>list=service.getAll();
        ApiResponse<List<OrderDetailResponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "OrderDetail retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOne(@PathVariable("id") Integer id){
        OrderDetailResponse orderResponse=service.getById(id);
        return ResponseEntity.ok(orderResponse);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> update(
            @PathVariable("id") Integer id,@RequestBody OrderDetailRequest orderDetailRequest){
        OrderDetailResponse orderResponse=service.update(id,orderDetailRequest);
        ApiResponse<OrderDetailResponse>apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "OrderDetail updated successfully",orderResponse);
        return  ResponseEntity.ok(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> delete(@PathVariable("id") Integer id){
        service.detele(id);
        ApiResponse<OrderDetailResponse> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod deleted successfully",null);
        return ResponseEntity.ok(apiResponse);
    }
}
