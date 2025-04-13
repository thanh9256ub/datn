package com.example.datn.service;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.request.OrderVoucherRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.dto.response.OrderVoucherReponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.OrderVoucher;
import com.example.datn.entity.Voucher;
import com.example.datn.mapper.OrderVoucherMapper;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.OrderVoucherRepository;
import com.example.datn.repository.VoucherRepository;
import jakarta.transaction.Transactional;
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
    @Transactional

    public OrderVoucherReponse create(OrderVoucherRequest request) {
        Voucher voucher = voucherRepository.findById(request.getVoucherId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher với ID: " + request.getVoucherId()));

        if (voucher.getQuantity() <= 0) {
            throw new RuntimeException("Mã khuyến mãi đã hết số lượng");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + request.getOrderId()));

        OrderVoucher orderVoucher = new OrderVoucher();
        orderVoucher.setOrder(order);
        orderVoucher.setVoucher(voucher);
        orderVoucher.setStatus(request.getStatus());

        voucher.setQuantity(voucher.getQuantity() - 1);
        voucherRepository.save(voucher);

        OrderVoucher created = repository.save(orderVoucher);
        return mapper.toOrderVoucherReponse(created);
    }
    public List<OrderVoucherReponse> getAll() {
        return mapper.toListReponses(repository.findAll());
    }

}
