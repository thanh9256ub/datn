package com.example.datn.service;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.entity.OrderDetail;
import com.example.datn.mapper.OrderDetailMapper;
import com.example.datn.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class OrderDetailService {

    @Autowired
    OrderDetailRepository repository;

    @Autowired
    OrderDetailMapper mapper;

    public OrderDetailResponse create(OrderDetailRequest request) {
        OrderDetail orderDetail = mapper.toOrderDetails(request);
        OrderDetail created = repository.save(orderDetail);
        return mapper.toOrderDetailResponse(created);
    }

    public List<OrderDetailResponse> getAll() {
        return mapper.toListResponses(repository.findAll());
    }

    public OrderDetailResponse getById(Integer id) {
        OrderDetail orderDetail = repository.findById(id).get();
        return mapper.toOrderDetailResponse(orderDetail);
    }

    public OrderDetailResponse update(Integer id, OrderDetailRequest orderDetailRequest) {
        OrderDetail orderDetail = repository.findById(id).get();
        mapper.update(orderDetail, orderDetailRequest);
        return mapper.toOrderDetailResponse(repository.save(orderDetail));
    }
    public void detele(Integer id){
        repository.deleteById(id);
    }


}
