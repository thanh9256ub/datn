package com.example.datn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendVoucherUpdate(String voucherCode) {
        String message = "Trạng thái của mã voucher " + voucherCode + " đã được cập nhật";
        messagingTemplate.convertAndSend("/topic/voucher-updates", message);
    }
}