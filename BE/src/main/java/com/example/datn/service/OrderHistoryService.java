package com.example.datn.service;

import com.example.datn.dto.request.OrderHistoryRequest;
import com.example.datn.dto.response.OrderHistoryResponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.OrderHistory;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.OrderHistoryMapper;
import com.example.datn.repository.OrderHistoryRepository;
import com.example.datn.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;

@Service
public class OrderHistoryService {
    @Autowired
    OrderHistoryRepository repository;
@Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderHistoryMapper mapper;

    public List<OrderHistoryResponse> getAll() {
        return mapper.toListOrderHistory(repository.findAll(Sort.by(Sort.Direction.DESC, "change_time")));
    }

    public OrderHistoryResponse createOrderHistory(OrderHistoryRequest request) {
        if (Objects.isNull(request.getOrderId())) {
            throw new IllegalArgumentException("orderId không được để trống");
        }
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại với id: " + request.getOrderId()));

        LocalDateTime changeTime;
        if (request.getChange_time() == null) {
            changeTime = LocalDateTime.now();
        } else {
            try {
                changeTime = request.getChange_time();
            } catch (DateTimeParseException e) {
                changeTime = LocalDateTime.now();
            }
        }
        request.setChange_time(changeTime);

        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            request.setDescription("Cập nhật trạng thái đơn hàng");
        }
        if (request.getIcon() == null || request.getIcon().trim().isEmpty()) {
            request.setIcon("status-update");
        }

        OrderHistory orderHistory = mapper.toOrderHistory(request);
        orderHistory.setOrder(order);

        OrderHistory created = repository.save(orderHistory);
        return mapper.toOrderHistoryResponse(created);
    }

    public OrderHistoryResponse getOrdHistoryById(Integer id) {

        OrderHistory orderHistory = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material id is not exists with given id: " + id));

        return mapper.toOrderHistoryResponse(orderHistory);
    }
    public List<OrderHistoryResponse> getListOrdHistoryByOrdId(Integer orderId ) {
        List<OrderHistory> orderHistories = repository.findByOrderId(orderId);
        return mapper.toListOrderHistory(orderHistories);
    }

}
