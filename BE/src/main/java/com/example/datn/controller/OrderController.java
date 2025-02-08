package com.example.datn.controller;

import com.example.datn.entity.Order;
import com.example.datn.service.DonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private DonHangService donHangService;
    @GetMapping("/listOrder")
    public List<Order>listDH(){
        return donHangService.getListDH();
    }
}
