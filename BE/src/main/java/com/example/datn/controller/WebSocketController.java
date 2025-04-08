package com.example.datn.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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
        String message = "🔄 Số lượng sản phẩm [" + productCode + "] đã thay đổi: " + newQuantity;
        log.info("📢 Gửi thông báo WebSocket: {}", message);
        messagingTemplate.convertAndSend("/topic/product-updates", message);
    }


}