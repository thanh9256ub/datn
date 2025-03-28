package com.example.datn.controller;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.service.OrderDetailService;
import com.example.datn.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.UUID;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/counter")
public class CounterController {

    private static final Logger logger = LoggerFactory.getLogger(CounterController.class);

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
        OrderResponse orderResponse = orderService.update(id, orderRequest);
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

    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinces() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching provinces");
        }
    }

    @GetMapping("/districts")
    public ResponseEntity<?> getDistricts(@RequestParam String provinceId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=" + provinceId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching districts");
        }
    }

    @GetMapping("/wards")
    public ResponseEntity<?> getWards(@RequestParam String districtId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://partner.viettelpost.vn/v2/categories/listWards?districtId=" + districtId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching wards");
        }
    }

    @DeleteMapping("/delete-order/{id}")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> delete(@PathVariable("id") Integer id) {
        orderDetailService.updateOrderDetail(id);
        orderDetailService.deteleOrderDetailByIdOrder(id);
        orderService.detele(id);
        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod deleted successfully", null);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/zalopay/payment")
    public ResponseEntity<?> generateZaloPayPayment(@RequestBody Map<String, Object> payload) {
        try {
            logger.info("Received ZaloPay payment request: {}", payload); // Log the incoming request

            String appId = "2554";
            String key1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";
            String key2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf";

            String transactionId = UUID.randomUUID().toString();
            long amount = Long.parseLong(payload.get("amount").toString());
            String description = payload.get("description").toString();

            // Create data for HMAC
            String data = appId + "|" + transactionId + "|" + amount + "|" + description;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key1.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            String macData = Base64.getEncoder().encodeToString(mac.doFinal(data.getBytes()));

            // Add bank_code and embed_data fields
            String bankCode = ""; // Empty for now
            String embedData = "{\"preferred_payment_method\": [\"vietqr\"]}";

            // Generate QR code URL using qr_code and additional fields
            String qrCodeUrl = "https://sandbox.zalopay.com.vn/qr?appid=" + appId + "&mac=" + macData + "&amount=" + amount + "&description=" + description + "&qr_code=true" +
                               "&bank_code=" + bankCode + "&embed_data=" + embedData;

            logger.info("Generated ZaloPay QR Code URL: {}", qrCodeUrl); // Log the generated QR code URL

            Map<String, Object> response = new HashMap<>();
            response.put("qrCodeUrl", qrCodeUrl);
            response.put("transactionId", transactionId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error generating ZaloPay payment", e); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating ZaloPay payment");
        }
    }

    @GetMapping("/zalopay/check-payment-status")
    public ResponseEntity<?> checkZaloPayPaymentStatus(@RequestParam String transactionId) {
        try {
            // Simulate payment status check (replace with actual API call if available)
            Map<String, Object> response = new HashMap<>();
            response.put("transactionId", transactionId);
            response.put("status", "SUCCESS"); // Simulate success status
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking ZaloPay payment status");
        }
    }

}

