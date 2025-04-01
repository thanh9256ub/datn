package com.example.datn.controller;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.ProductDetail;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.ProductDetailRepository;
import com.example.datn.service.OrderDetailService;
import com.example.datn.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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

import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/counter")
public class CounterController {

    private static final Logger logger = LoggerFactory.getLogger(CounterController.class);

    @Autowired
    OrderService orderService;
    @Autowired
    OrderDetailService orderDetailService;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ProductDetailRepository productDetailRepository;

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
//@GetMapping("/add-to-cart")
//public ResponseEntity<ApiResponse<OrderDetailResponse>> addToCart(
//        @RequestParam("orderID") Integer orderID,
//        @RequestParam("productID") Integer productID,
//        @RequestParam("purchaseQuantity") Integer purchaseQuantity) {
//    try {
//        // Kiểm tra orderID tồn tại
//        if (!orderRepository.existsById(orderID)) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Order not found with ID: " + orderID, null));
//        }
//
//        // Kiểm tra productID và số lượng
//        ProductDetail productDetail = productDetailRepository.findById(productID).orElse(null);
//        if (productDetail == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Product not found with ID: " + productID, null));
//        }
//        if (productDetail.getQuantity() < purchaseQuantity) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Insufficient quantity for product ID: " + productID, null));
//        }
//
//        // Cập nhật số lượng sản phẩm và thêm vào giỏ
//        orderDetailService.updateProductQuantity(productID, purchaseQuantity);
//        OrderDetailResponse orderDetailResponse = orderDetailService.updateOrAddOrderDetail(orderID, productID, purchaseQuantity);
//        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Order detail updated successfully", orderDetailResponse));
//    } catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error adding to cart: " + e.getMessage(), null));
//    }
//}
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

}

