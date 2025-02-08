package com.example.datn.service;

import com.example.datn.dto.request.SanPhamRequest;
import com.example.datn.dto.response.ThuongHieuResponse;
import com.example.datn.entity.ThuongHieu;
import com.example.datn.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThuongHieuService {

    @Autowired
    ThuongHieuRepository repository;

    public List<ThuongHieuResponse> getAll(){
        return repository.getAllResponse();
    }

    public void themSanPham(SanPhamRequest sanPhamRequest){

    }
}
