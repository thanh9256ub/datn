package com.example.datn.controller;

import com.example.datn.dto.request.*;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CartDetailsResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.service.CartDetailsService;
import com.example.datn.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/cart-details")
public class CartDetailsController {
    @Autowired
    private CartDetailsService service;
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDetailsResponse>> addProductToCart(
            @Valid @RequestBody AddToCartRequest request) {
        try {
            System.out.println("Received add to cart request: " + request.toString());
            CartDetailsResponse response = service.addProductToCart(request);
            System.out.println("Successfully added to cart: " + response.toString());
            return ResponseEntity.ok(new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Product added to cart",
                    response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Error adding product to cart: " + e.getMessage(), null));
        }
    }
    // Tạo một cart mới
//    @PostMapping("/add")
//    public ResponseEntity<ApiResponse<CartDetailsResponse>> addCart(@Valid @RequestBody CartDetailsRequest request) {
//        CartDetailsResponse cartDetailsResponse = service.createCart(request);
//
//        ApiResponse<CartDetailsResponse> response = new ApiResponse<>(
//                HttpStatus.CREATED.value(),
//                "Cart created successfully",
//                cartDetailsResponse
//        );
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }

    // Lấy danh sách tất cả các cart
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartDetailsResponse>>> getAllCarts() {
        List<CartDetailsResponse> carts = service.getAll();

        ApiResponse<List<CartDetailsResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Carts retrieved successfully",
                carts
        );

        return ResponseEntity.ok(response);
    }

    // Lấy thông tin cart theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CartDetailsResponse>> getCartById(@PathVariable("id") Long id) {
        CartDetailsResponse cartDetailsResponse = service.getCartById(id);

        ApiResponse<CartDetailsResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart retrieved successfully",
                cartDetailsResponse
        );

        return ResponseEntity.ok(response);
    }

    // Cập nhật thông tin cart theo ID
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<CartDetailsResponse>> updateCart(
            @PathVariable("id") Long id,
            @Valid @RequestBody CartDetailsRequest request) {
        CartDetailsResponse cartDetailsResponse = service.updateCart(id, request);

        ApiResponse<CartDetailsResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart updated successfully",
                cartDetailsResponse
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<List<CartDetailsResponse>> updateCartDetails(
            @PathVariable Integer cartId,
            @RequestBody List<UpdateCartDetailsRequest> requests) {
        List<CartDetailsResponse> response = service.updateCartDetails(cartId, requests);
        return ResponseEntity.ok(response);
    }

    // Xóa cart theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CartDetailsResponse>> deleteCart(@PathVariable("id") Long id) {
        service.deleteCart(id);

        ApiResponse<CartDetailsResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/cart/{cartId}")
    public ResponseEntity<ApiResponse<List<CartDetailsResponse>>> getCartDetailsByCartId(@PathVariable("cartId") Integer cartId) {
        List<CartDetailsResponse> cartDetails = service.getCartDetailsByCartId(cartId);

        ApiResponse<List<CartDetailsResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart details retrieved successfully",
                cartDetails
        );

        return ResponseEntity.ok(response);
    }
    @PutMapping("/update-quantity/{id}")
    public ResponseEntity<ApiResponse<CartDetailsResponse>> updateCartQuantity(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateCartQuantityRequest    request) {
        try {
            CartDetailsResponse response = service.updateCartQuantity(id, request.getQuantity());
            return ResponseEntity.ok(new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Cart quantity updated successfully",
                    response
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Error updating cart quantity: " + e.getMessage(), null));
        }
    }
}
