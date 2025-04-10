package com.example.datn.controller;

import com.example.datn.dto.request.GuestOrderRequest;
import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.ProductDetail;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.ProductDetailRepository;
import com.example.datn.service.OrderDetailService;
import com.example.datn.service.OrderService;
import com.example.datn.service.ProductDetailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.util.UriComponentsBuilder;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/counter")
public class CounterController {

    private static final Logger logger = LoggerFactory.getLogger(CounterController.class);

    private static final String VNP_TMN_CODE = "DLO4BO7S";
    private static final String VNP_HASH_SECRET = "X7SNCY4MFJXV8RM446395M52ARVFS5MD";
    private static final String VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private static final String VNP_RETURN_URL = "https://sharing-cub-meet.ngrok-free.app/counter/vnpay-return";
    private static final String VNP_API_VERSION = "2.1.0";
    private static final String VNP_COMMAND = "pay";
    private static final String VNP_CURRENCY = "VND";
    private static final String VNP_LOCALE = "vn";
    private static final String VNP_ORDER_TYPE = "billpayment";

    @Autowired
    OrderService orderService;
    @Autowired
    OrderDetailService orderDetailService;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ProductDetailRepository productDetailRepository;
    @Autowired
    ProductDetailService productDetailService;

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
        productDetailService.updateProductDetaiStatus0();
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
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzM1NjAyMTE1IiwiVXNlcklkIjoxNTgzOTczNCwiRnJvbVNvdXJjZSI6NSwiVG9rZW4iOiJKWEdZV0Q5QTkwQyIsImV4cCI6MTc0MjE4MjU2MCwiUGFydG5lciI6MTU4Mzk3MzR9.hdibqEJCL4qN1qO7JGPMEnisfUgvRdng1pWDaBhVL_Iz71NhRWMCCPXyz9GydOhazXxIzjLYzS26mdacsyRlYg");
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
//
//    @DeleteMapping("/delete-order/{id}")
//    public ResponseEntity<ApiResponse<OrderDetailResponse>> delete(@PathVariable("id") Integer id) {
//        orderDetailService.updateOrderDetail(id);
//        orderDetailService.deteleOrderDetailByIdOrder(id);
//        orderService.detele(id);
//        ApiResponse<OrderDetailResponse> apiResponse = new ApiResponse<>(
//                HttpStatus.OK.value(), "PaymentMethod deleted successfully", null);
//        return ResponseEntity.ok(apiResponse);
//    }
@DeleteMapping("/delete-order/{id}")
public ResponseEntity<ApiResponse<OrderDetailResponse>> delete(@PathVariable("id") Integer id) {
    try {
        // Kiểm tra order tồn tại
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "Order not found with ID: " + id, null));
        }

        // Lấy danh sách chi tiết đơn hàng và hoàn lại số lượng sản phẩm
        List<OrderDetailResponse> orderDetails = orderDetailService.getOrderDetailsByOrderId(id);
        for (OrderDetailResponse detail : orderDetails) {
            ProductDetail productDetail = detail.getProductDetail();
            productDetail.setQuantity(productDetail.getQuantity() + detail.getQuantity());
            productDetailRepository.save(productDetail);
            orderDetailService.detele(detail.getId());
        }

        // Xóa đơn hàng
        orderService.detele(id);

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Order deleted successfully", null));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting order: " + e.getMessage(), null));
    }
}
    @PostMapping("/zalopay/payment")
    public ResponseEntity<?> generateZaloPayPayment(@RequestBody Map<String, Object> payload) {
        try {
            logger.info("Received ZaloPay payment request: {}", payload); // Log the incoming request

            String appId = "2554";
            String key1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";

            // Generate unique transaction ID and timestamp
            String orderId = payload.get("orderId").toString();
            long appTime = System.currentTimeMillis(); // Current time in milliseconds
            String appTransId = new java.text.SimpleDateFormat("yyMMdd").format(new java.util.Date()) + "_" + appTime; // Format: yymmdd_<timestamp>
            long amount = Long.parseLong(payload.get("amount").toString());
            String description = "Demo - Thanh toan don hang #" + appTransId;

            // Embed data and items
            String embedData = "{\"promotioninfo\":\"\",\"merchantinfo\":\"embeddata123\"}";
            String item = "[{\"itemid\":\"knb\",\"itemname\":\"kim nguyen bao\",\"itemprice\":198400,\"itemquantity\":1}]";
            String bankCode = ""; // Add bank_code field
            String callbackUrl = "https://yourdomain.com/callback"; // Optional callback URL
            long expireDurationSeconds = 900; // Optional expiration duration (15 minutes)

            // Create data for HMAC
            String hmacInput = appId + "|" + appTransId + "|" + "demo" + "|" + amount + "|" + appTime + "|" + embedData + "|" + item;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key1.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            String macData = bytesToHex(mac.doFinal(hmacInput.getBytes()));

            // Prepare request payload for ZaloPay API
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("app_id", appId);
            requestPayload.put("app_user", "demo");
            requestPayload.put("app_time", appTime);
            requestPayload.put("amount", amount);
            requestPayload.put("app_trans_id", appTransId);
            requestPayload.put("description", description);
            requestPayload.put("embed_data", embedData);
            requestPayload.put("item", new ObjectMapper().readValue(item, List.class)); // Parse item as JSON array
            requestPayload.put("bank_code", bankCode); // Include bank_code in the payload
            requestPayload.put("key1", key1);
            requestPayload.put("mac", macData);

            logger.info("ZaloPay API Request Payload: {}", requestPayload); // Log the request payload

            // Call ZaloPay API
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestPayload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://sb-openapi.zalopay.vn/v2/create",
                    request,
                    Map.class
            );

            // Extract order_url from ZaloPay API response
            Map<String, Object> responseBody = response.getBody();
            logger.info("ZaloPay API Response: {}", responseBody); // Log the API response

            if (responseBody != null && responseBody.containsKey("order_url")) {
                String orderUrl = responseBody.get("order_url").toString();
                logger.info("Generated ZaloPay Order URL: {}", orderUrl); // Log the generated order URL

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("order_url", orderUrl);
                responseMap.put("transactionId", appTransId);

                return ResponseEntity.ok(responseMap);
            } else {
                logger.error("ZaloPay API did not return an order_url: {}", responseBody);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating ZaloPay payment: " + responseBody);
            }
        } catch (Exception e) {
            logger.error("Error generating ZaloPay payment", e); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating ZaloPay payment: " + e.getMessage());
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
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

    @PostMapping("/casso/transactions")
    public ResponseEntity<?> fetchCassoTransactions() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Apikey AK_CS.2cb7a1d00c7e11f097089522635f3f80.vKo3BAFDtz8c3vnVSliZ9KKQ2mrvLufagmFwVu9mSmKHUlQmzLgmEzybGLns1tYUm1lX7DVn");

            HttpEntity<String> request = new HttpEntity<>(headers);
            String url = "https://oauth.casso.vn/v2/transactions";

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

            // Extract records from the response
            //List<Map<String, Object>> records = (List<Map<String, Object>>) response;

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching transactions from Casso.vn", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching transactions from Casso.vn: " + e.getMessage());
        }
    }
    @PutMapping("/update-order-details/{orderId}")
    public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> updateOrderDetails(
            @PathVariable("orderId") Integer orderId,
            @RequestBody List<OrderDetailRequest> items) {
        try {
            List<OrderDetailResponse> updatedDetails = orderDetailService.updateOrderDetails(orderId, items);
            ApiResponse<List<OrderDetailResponse>> apiResponse = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Order details updated successfully",
                    updatedDetails
            );
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<OrderDetailResponse>> apiResponse = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Error updating order details: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }

    }
    @PostMapping("/vnpay/payment")
    public ResponseEntity<Map<String, String>> generateVNPayPayment(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        try {
            // Validate request
            if (!validateVNPayRequest(payload)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid request parameters"));
            }

            // Prepare parameters
            String orderId = payload.get("orderId").toString();
            long amount = (long) (Double.parseDouble(payload.get("amount").toString()) * 100);
            String clientIP = getClientIP(request);

            // Create sorted params (TreeMap automatically sorts by key)
            TreeMap<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", VNP_API_VERSION);
            vnpParams.put("vnp_Command", VNP_COMMAND);
            vnpParams.put("vnp_TmnCode", VNP_TMN_CODE);
            vnpParams.put("vnp_Amount", String.valueOf(amount));
            vnpParams.put("vnp_CurrCode", VNP_CURRENCY);
            vnpParams.put("vnp_TxnRef", orderId);
            vnpParams.put("vnp_OrderInfo", "Thanh toan don hang #" + orderId);
            vnpParams.put("vnp_OrderType", VNP_ORDER_TYPE);
            vnpParams.put("vnp_Locale", VNP_LOCALE);
            vnpParams.put("vnp_ReturnUrl", VNP_RETURN_URL);
            vnpParams.put("vnp_IpAddr", clientIP);
            vnpParams.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
            // Generate secure hash
            String secureHash = generateSecureHash(vnpParams);

            // Build payment URL with single encoding
            String paymentUrl = buildVNPayPaymentUrl(vnpParams, secureHash);

            logger.info("Generated VNPay URL for order {}: {}", orderId, paymentUrl);

            return ResponseEntity.ok(Map.of(
                    "code", "00",
                    "message", "success",
                    "paymentUrl", paymentUrl,
                    "transactionId", orderId
            ));

        } catch (Exception e) {
            logger.error("VNPay payment processing failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Payment processing failed: " + e.getMessage()));
        }
    }

    private String generateSecureHash(TreeMap<String, String> params) throws Exception {
        StringBuilder hashData = new StringBuilder();
        boolean firstParam = true;

        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (!firstParam) {
                    hashData.append('&');
                }
                hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
                hashData.append('=');
                hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                firstParam = false;
            }
        }
        logger.info("Raw data for hash: {}", hashData.toString());
        return hmacSHA512(VNP_HASH_SECRET, hashData.toString());
    }
    private boolean validateVNPayRequest(Map<String, Object> payload) {
        return payload.containsKey("orderId")
               && payload.containsKey("amount")
               && !payload.get("orderId").toString().isEmpty()
               && payload.get("amount") != null;
    }
    private String hmacSHA512(String key, String data) throws Exception {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA512"
            );
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert byte array to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().toLowerCase(Locale.ROOT);
        } catch (Exception e) {
            logger.error("Error creating HMAC-SHA512", e);
            throw new RuntimeException("Cannot create HMAC-SHA512", e);
        }
    }
    private String buildVNPayPaymentUrl(TreeMap<String, String> params, String secureHash) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(VNP_URL);

        // Add all parameters with single URL encoding
        params.forEach((key, value) -> {
            try {
                builder.queryParam(
                        key,
                        URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
                                .replace("+", "%20")
                );
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("URL encoding failed", e);
            }
        });

        // Add secure hash (no encoding)
        builder.queryParam("vnp_SecureHash", secureHash);

        return builder.build().toUriString();
    }

    private String encodeURLComponent(String component) {
        try {
            return URLEncoder.encode(component, "UTF-8")
                    .replace("+", "%20")
                    .replace("*", "%2A")
                    .replace("%7E", "~");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("URL encoding failed", e);
        }
    }
    @GetMapping("/vnpay/check-payment-status")
    public ResponseEntity<?> checkVNPayPaymentStatus(@RequestParam String transactionId) {
        try {
            String status = orderService.checkPaymentStatus(transactionId);
            Map<String, Object> response = new HashMap<>();
            response.put("transactionId", transactionId);
            response.put("status", status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking VNPay payment status for transactionId: {}", transactionId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error checking payment status: " + e.getMessage()));
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, String>> vnpayReturnHandler(
            @RequestParam Map<String, String> allParams,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            logger.info("VNPay Callback Params: {}", allParams);

            Map<String, String> vnpParams = new TreeMap<>(allParams);
            vnpParams.remove("vnp_SecureHashType");
            vnpParams.remove("vnp_SecureHash");

            String vnp_SecureHash = allParams.get("vnp_SecureHash");
            if (vnp_SecureHash == null) {
                response.put("message", "Missing vnp_SecureHash");
                return ResponseEntity.badRequest().body(response);
            }

            String signValue = buildHashData(vnpParams);
            String computedHash = hmacSHA512(VNP_HASH_SECRET, signValue);

            logger.info("Computed Hash: {}", computedHash);
            logger.info("Received Hash: {}", vnp_SecureHash);

            if (!computedHash.equalsIgnoreCase(vnp_SecureHash)) {
                logger.error("Invalid signature. Expected: {} - Actual: {}", computedHash, vnp_SecureHash);
                response.put("message", "Invalid signature");
                return ResponseEntity.badRequest().body(response);
            }

            String responseCode = allParams.get("vnp_ResponseCode");
            String orderId = allParams.get("vnp_TxnRef");

            if ("00".equals(responseCode)) {
                OrderResponse updatedOrder = orderService.updateStatus(
                        orderRepository.findByOrderCode(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found with code: " + orderId))
                                .getId(),
                        2
                );
                logger.info("Payment success for order: {}", orderId);
                response.put("message", "Payment success");
                response.put("status", "SUCCESS");
            } else {
                logger.warn("Payment failed. Code: {}", responseCode);
                orderService.updateStatus(
                        orderRepository.findByOrderCode(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found with code: " + orderId))
                                .getId(),
                        5
                );
                response.put("message", "Payment failed. Code: " + responseCode);
                response.put("status", "FAILED");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("VNPay callback processing error", e);
            response.put("message", "Server error");
            response.put("status", "ERROR");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private String buildHashData(Map<String, String> params) {
        StringBuilder hashData = new StringBuilder();
        boolean firstParam = true;

        // Sắp xếp tất cả các tham số theo thứ tự bảng chữ cái
        for (Map.Entry<String, String> entry : new TreeMap<>(params).entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (!firstParam) {
                    hashData.append('&');
                }
                try {
                    hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException("URL encoding failed", e);
                }
                firstParam = false;
            }
        }

        String result = hashData.toString();
        logger.info("Raw data for hash verification: {}", result); // Giữ log để kiểm tra
        return result;
    }

    private String getClientIP(HttpServletRequest request) {
        // Ưu tiên lấy IP từ các header proxy (nếu có)
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // Xử lý trường hợp localhost hoặc IPv6
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            ip = "14.181.139.170"; // Hardcode IP public của bạn
        }

        // Lấy IP đầu tiên nếu có nhiều IP (ví dụ: "client, proxy1, proxy2")
        return ip.split(",")[0].trim();
    }

}

