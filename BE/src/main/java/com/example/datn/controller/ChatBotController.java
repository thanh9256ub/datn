package com.example.datn.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {

    @PostMapping("/train")
    public ResponseEntity<String> trainAI(@RequestBody Map<String, Object> trainingData) {
        // Simulate training logic
        System.out.println("Received training data: " + trainingData);

        // Placeholder for actual training logic
        boolean trainingSuccess = true;

        if (trainingSuccess) {
            return new ResponseEntity<>("AI training successful!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("AI training failed.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product-details")
    public ResponseEntity<Map<String, Object>> getProductDetails(@RequestParam String query) {
        // Simulate product detail retrieval logic
        System.out.println("Received product query: " + query);

        // Example product details (replace with actual database/service logic)
        Map<String, Object> productDetails = new HashMap<>();
        productDetails.put("name", "Áo Thun Nam");
        productDetails.put("image", "https://example.com/images/product1.jpg");
        productDetails.put("size", "M, L, XL");
        productDetails.put("color", "Đỏ, Xanh, Trắng");

        return new ResponseEntity<>(productDetails, HttpStatus.OK);
    }
}
