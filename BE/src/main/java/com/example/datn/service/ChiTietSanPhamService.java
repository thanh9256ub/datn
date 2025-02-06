package com.example.datn.service;

import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.repository.ChiTietSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChiTietSanPhamService {
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public List<ChiTietSanPham>getListCTSP(){
        return chiTietSanPhamRepository.findAll();
    }
}
