package com.example.datn.controller;

import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.PaymentType;
import com.example.datn.service.PaymentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment-type")
public class PaymentTypeController {
    @Autowired
    PaymentTypeService service;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<PaymentTypeResponse>> addPaymentType(
            @RequestBody PaymentTypeRequest paymentTypeRequest) {
        PaymentTypeResponse paymentTypeResponse = service.createPaymentType(paymentTypeRequest);
        ApiResponse<PaymentTypeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", paymentTypeResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentTypeResponse>>> getAll(){
        List<PaymentTypeResponse>list=service.getAll();
        ApiResponse<List<PaymentTypeResponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentType retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/{id}")
    public ResponseEntity<PaymentTypeResponse> getOne(@PathVariable("id") Integer id){
        PaymentTypeResponse paymentTypeResponse=service.getPaymentTypeById(id);
        return ResponseEntity.ok(paymentTypeResponse);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<PaymentTypeResponse>> updatePaymentType(
            @PathVariable("id") Integer id,@RequestBody PaymentTypeRequest paymentTypeRequest){
        PaymentTypeResponse paymentTypeResponse=service.updatePaymentType(id,paymentTypeRequest);
        ApiResponse<PaymentTypeResponse>apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentType updated successfully",paymentTypeResponse);
        return  ResponseEntity.ok(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentTypeResponse>> deletePaymentType(@PathVariable("id") Integer id){
        service.detelePaymentType(id);
        ApiResponse<PaymentTypeResponse> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentType deleted successfully",null);
        return ResponseEntity.ok(apiResponse);
    }

}
