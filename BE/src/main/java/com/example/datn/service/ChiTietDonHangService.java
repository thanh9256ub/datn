package com.example.datn.service;

import com.example.datn.entity.ChiTietDonHang;
import com.example.datn.repository.ChiTietDonHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ChiTietDonHangService {
    @Autowired
    private ChiTietDonHangRepository chiTietDonHangRepository;
    public List<ChiTietDonHang> getListCTDH(){
        return chiTietDonHangRepository.findAll();
    }
}
