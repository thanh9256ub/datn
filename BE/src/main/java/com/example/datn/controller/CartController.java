package com.example.datn.controller;

import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Cart;
import com.example.datn.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/carts")
public class CartController {
    @Autowired
    private CartService cartService;

    // Tạo một cart mới
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addCart(@Valid @RequestBody CartRequest request) {
        CartResponse cartResponse = cartService.createCart(request);

        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Cart created successfully",
                cartResponse
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Lấy danh sách tất cả các cart
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponse>>> getAllCarts() {
        List<CartResponse> carts = cartService.getAll();

        ApiResponse<List<CartResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Carts retrieved successfully",
                carts
        );

        return ResponseEntity.ok(response);
    }

    // Lấy thông tin cart theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> getCartById(@PathVariable("id") Integer id) {
        CartResponse cartResponse = cartService.getCartById(id);

        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart retrieved successfully",
                cartResponse
        );

        return ResponseEntity.ok(response);
    }

    // Cập nhật thông tin cart theo ID
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCart(
            @PathVariable("id") Integer id,
            @Valid @RequestBody CartRequest request) {
        CartResponse cartResponse = cartService.updateCart(id, request);

        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart updated successfully",
                cartResponse
        );

        return ResponseEntity.ok(response);
    }

    // Xóa cart theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> deleteCart(@PathVariable("id") Integer id) {
        cartService.deleteCart(id);

        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cart deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/get-or-create/{customerId}")
    public ResponseEntity<ApiResponse<CartResponse>> getOrCreateCart(@PathVariable("customerId") Integer customerId) {
        try {
            Cart cart = cartService.getOrCreateCart(customerId); // Nhận Cart
            CartResponse cartResponse = cartService.getCartById(cart.getId()); // Chuyển thành CartResponse
            return ResponseEntity.ok(new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Cart retrieved or created successfully",
                    cartResponse
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null)
            );
        }
    }
}
