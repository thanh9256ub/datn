package com.example.datn.controller;

import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Cart;
import com.example.datn.service.CartService;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/carts")
public class CartController {
    @Autowired
    private CartService cartService;
    @Value("${jwt.signerKey}") // Lấy SIGNER_KEY từ application.properties
    private String SIGNER_KEY;
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
    public ResponseEntity<ApiResponse<CartResponse>> getOrCreateCart(
            @PathVariable("customerId") Integer customerId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            // Kiểm tra token nếu có
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                SignedJWT signedJWT = SignedJWT.parse(token);
                JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
                boolean isValid = signedJWT.verify(verifier);

                if (!isValid) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                            new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "Invalid token", null)
                    );
                }

                // Kiểm tra thời gian hết hạn
                if (signedJWT.getJWTClaimsSet().getExpirationTime().before(new Date())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                            new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "Token expired", null)
                    );
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        new ApiResponse<>(HttpStatus.UNAUTHORIZED.value(), "No token provided", null)
                );
            }

            // Logic lấy hoặc tạo giỏ hàng
            Cart cart = cartService.getOrCreateCart(customerId); // Cập nhật CartService để nhận String
            CartResponse cartResponse = cartService.getCartById(cart.getId());
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
