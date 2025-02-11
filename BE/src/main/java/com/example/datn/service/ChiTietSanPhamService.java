package com.example.datn.service;

import com.example.datn.entity.ProductDetail;
import com.example.datn.repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietSanPhamService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    public List<ProductDetail> getListCTSP() {
        return productDetailRepository.findAll();
    }
}
