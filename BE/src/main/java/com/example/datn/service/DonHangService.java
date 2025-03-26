package com.example.datn.service;

import com.example.datn.entity.Order;
import com.example.datn.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DonHangService {
    @Autowired
    private OrderRepository orderRepository;
   public   List<Order>getListDH(){
        return orderRepository.findAll();
    }
}