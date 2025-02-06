package com.example.datn.controller;

import com.example.datn.entity.DonHang;
import com.example.datn.service.DonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

public class DonHangController {
    @Autowired
    private DonHangService donHangService;
    @GetMapping("/listDH")
    public List<DonHang>listDH(){
        return donHangService.getListDH();
    }
}
