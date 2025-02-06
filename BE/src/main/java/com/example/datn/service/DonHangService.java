package com.example.datn.service;

import com.example.datn.entity.DonHang;
import com.example.datn.repository.DonHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DonHangService {
    @Autowired
    private DonHangRepository donHangRepository;
   public   List<DonHang>getListDH(){
        return donHangRepository.findAll();
    }
}
