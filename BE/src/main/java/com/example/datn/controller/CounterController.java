package com.example.datn.controller;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.service.OrderDetailService;
import com.example.datn.service.OrderService;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/counter")
public class CounterController {

    @Autowired
    OrderService orderService;
    @Autowired
    OrderDetailService orderDetailService;

    @GetMapping("/add-to-cart")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> addToCart(@RequestParam Integer orderID,
                                                                      @RequestParam Integer productID,
                                                                      @RequestParam Integer purchaseQuantity) {
        orderDetailService.updateProductQuantity(productID, purchaseQuantity);
        // Update or add order detail
        OrderDetailResponse orderDetailResponse = orderDetailService.updateOrAddOrderDetail(orderID, productID, purchaseQuantity);
        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order detail updated successfully", orderDetailResponse);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/update-quantity")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> updateQuantity(@RequestParam Integer orderDetailID,
                                                                           @RequestParam Integer productDetailID,
                                                                           @RequestParam Integer quantity) {
        orderDetailService.updateProductDetail(orderDetailID, productDetailID, quantity);
        OrderDetailResponse orderDetailResponse = orderDetailService.updateOrderDetail(orderDetailID, quantity);


        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order detail updated successfully", orderDetailResponse);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/update-quantity2")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> updateQuantity2(@RequestParam Integer orderDetailID,
                                                                            @RequestParam Integer productDetailID,
                                                                            @RequestParam Integer quantity) {
         orderDetailService.updateProductDetail(orderDetailID, productDetailID, quantity);



        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order detail updated successfully", null);
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/update-quantity3")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> updateQuantity3(@RequestParam Integer orderDetailID,
                                                                            @RequestParam Integer productDetailID,
                                                                            @RequestParam Integer quantity) {
        orderDetailService.updateProductDetail(orderDetailID, productDetailID, quantity);

        orderDetailService.detele(orderDetailID);

        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order detail updated successfully", null);
        return ResponseEntity.ok(apiResponse);
    }
    @PostMapping("/comfirm/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> confirm(@PathVariable Integer id, @RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = orderService.update(id,orderRequest);
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order  successfully", orderResponse);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/get-price")
    public ResponseEntity<?> getShippingFee(@RequestBody Map<String, Object> payload) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Token", "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzM1NjAyMTE1IiwiVXNlcklkIjoxNTgzOTczNCwiRnJvbVNvdXJjZSI6NSwiVG9rZW4iOiJKWEdZV0Q5QTkwQyIsImV4cCI6MTc0MjE4MjU2MCwiUGFydG5lciI6MTU4Mzk3MzR9.hdibqEJCL4qN1qO7JGPMEnisfUgvRdng1pWDaBhVL_Iz71NhRWMCCPXyz9GydOhazXxIzjLYzS26mdacsyRlYg"); // Token bạn đang dùng

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://partner.viettelpost.vn/v2/order/getPrice",
                    request,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calling Viettel Post API");
        }
    }
}

