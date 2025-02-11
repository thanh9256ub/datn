package com.example.datn.controller;

import com.example.datn.entity.OrderDetails;
import com.example.datn.service.ChiTietDonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

public class ChiTietDonHangController {
    @Autowired
    private ChiTietDonHangService chiTietDonHangService;
    @GetMapping("listCTDH")
    public List<OrderDetails> listCTDH(){
        return chiTietDonHangService.getListCTDH();
    }
}
