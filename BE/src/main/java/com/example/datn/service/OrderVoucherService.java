package com.example.datn.service;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.request.OrderVoucherRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderVoucherReponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.OrderVoucher;
import com.example.datn.mapper.OrderVoucherMapper;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.OrderVoucherRepository;
import com.example.datn.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class OrderVoucherService {
    @Autowired
    OrderVoucherRepository repository;
    @Autowired
    VoucherRepository voucherRepository;
    @Autowired
    OrderVoucherMapper mapper;
    @Autowired
    OrderRepository orderRepository;
    public OrderVoucherReponse create(OrderVoucherRequest request) {
        OrderVoucher orderVoucher = new OrderVoucher();
        orderVoucher.setOrder(orderRepository.findById(request.getOrderId()).get());
        orderVoucher.setVoucher(voucherRepository.findById(request.getVoucherId()).get());
        orderVoucher.setStatus(request.getStatus());
        OrderVoucher created = repository.save(orderVoucher);
        return mapper.toOrderVoucherReponse(created);
    }
    public List<OrderVoucherReponse> getAll() {
        return mapper.toListReponses(repository.findAll());
    }

}
