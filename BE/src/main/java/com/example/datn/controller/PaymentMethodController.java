package com.example.datn.controller;

import com.example.datn.dto.request.PaymentMethodRequest;
import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.PaymentMethodResponse;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.service.PaymentMethodService;
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
@RequestMapping("payment-method")
public class PaymentMethodController {
    @Autowired
    PaymentMethodService service;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> add(
            @RequestBody PaymentMethodRequest paymentMethodRequest) {
        PaymentMethodResponse paymentMethodResponse = service.createPaymentMethod(paymentMethodRequest);
        ApiResponse<PaymentMethodResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", paymentMethodResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentMethodResponse>>> getAll(){
        List<PaymentMethodResponse>list=service.getAll();
        ApiResponse<List<PaymentMethodResponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> getOne(@PathVariable("id") Integer id){
        PaymentMethodResponse paymentMethodResponse=service.getPaymentMethodById(id);
        return ResponseEntity.ok(paymentMethodResponse);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> update(
            @PathVariable("id") Integer id,@RequestBody PaymentMethodRequest paymentMethodRequest){
        PaymentMethodResponse paymentMethodResponse=service.updatePaymentMethod(id,paymentMethodRequest);
        ApiResponse<PaymentMethodResponse>apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod updated successfully",paymentMethodResponse);
        return  ResponseEntity.ok(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> delete(@PathVariable("id") Integer id){
        service.detelePaymentMethod(id);
        ApiResponse<PaymentMethodResponse> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod deleted successfully",null);
        return ResponseEntity.ok(apiResponse);
    }
}
