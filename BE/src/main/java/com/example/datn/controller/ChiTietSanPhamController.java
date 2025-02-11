package com.example.datn.controller;

import com.example.datn.entity.ProductDetail;
import com.example.datn.service.ChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

public class ChiTietSanPhamController {

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;

    @GetMapping("/listCTSP")
    public List<ProductDetail> listCTSP(){
        return chiTietSanPhamService.getListCTSP();
    }
}
