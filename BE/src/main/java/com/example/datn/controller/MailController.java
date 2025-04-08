package com.example.datn.controller;

import com.example.datn.dto.request.OrderConfirmationEmailRequest;
import com.example.datn.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("mail")
public class MailController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send-order-confirmation")
    public ResponseEntity<?> sendOrderConfirmation(@RequestBody OrderConfirmationEmailRequest request) {
        try {
            emailService.sendOrderConfirmationEmail(
                    request.getEmail(),
                    request.getOrderCode(),
                    request.getCustomerName(),
                    request.getTotalAmount(),
                    request.getPaymentMethod()
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
    }
}
