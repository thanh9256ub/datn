package com.example.datn.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendVoucherUpdate(String voucherCode) {
        String message = "Trạng thái của mã voucher " + voucherCode + " đã được cập nhật";
        log.info("📢 Gửi thông báo WebSocket: {}", message);
        messagingTemplate.convertAndSend("/topic/voucher-updates", message);
    }

    public void sendProductQuantityUpdate(String productCode, int newQuantity) {
        String message = "🔄 Số lượng sản phẩm [" + productCode + "] đã được cập nhật: " + newQuantity;
        log.info("📢 Gửi thông báo WebSocket: {}", message);
        messagingTemplate.convertAndSend("/topic/product-updates", message);
    }

    public void sendProductUpdate(String productCode, int newQuantity) {
        String message = "🔄 Số lượng sản phẩm [" + productCode + "] đã được cập nhật: " + newQuantity;

        log.info("🚀 Gửi realtime update sản phẩm {}: {}", productCode, newQuantity);
        messagingTemplate.convertAndSend("/topic/product-updates", message);
    }

    public void notifyOrderDeletion() {
        String payload = "Đã xoá những hóa đơn cũ";
        messagingTemplate.convertAndSend("/topic/orders/delete", payload);
    }

    public void sendOrderCustomer(String orderCode, String ctmName){
        String message = "Khách hàng "+ ctmName + " vừa mua hàng với đơn hàng là: " + orderCode;
        messagingTemplate.convertAndSend("/topic/order-customer", message);
    }

    public void sendOrderGuest(String orderCode){
        String message = "Khách hàng vãng lai vừa mua hàng với đơn hàng là: " + orderCode;
        messagingTemplate.convertAndSend("/topic/order-customer", message);
    }

    public void sendUpdateStatusOrder(String orderCode, Integer newStatus) {
        Map<String, Object> message = new HashMap<>();
        message.put("orderCode", orderCode);
        message.put("status", newStatus);
        message.put("message", "Đã cập nhật trạng thái đơn hàng: " + orderCode);
        messagingTemplate.convertAndSend("/topic/order-update-status", message);
    }

    public void sendUpdateStatusCustomer(String code){
        String massage = "Khách hàng đã bị khoá tài khoản: " + code;
        messagingTemplate.convertAndSend("/topic/customer-status", massage);
    }

    public void sendProductPriceUpdate(Integer productId, String productCode, Integer colorId, Integer sizeId, Double newPrice, Integer productDetailId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("productId", productId);
        payload.put("productCode", productCode);
        payload.put("colorId", colorId);
        payload.put("sizeId", sizeId);
        payload.put("newPrice", newPrice);
        payload.put("productDetailId", productDetailId);
        payload.put("type", "priceUpdate"); // Thêm trường type để phân biệt

        log.info("🚀 Gửi realtime update giá sản phẩm {}: {}", productCode, newPrice);
        messagingTemplate.convertAndSend("/topic/product-updates", payload);
    }
}