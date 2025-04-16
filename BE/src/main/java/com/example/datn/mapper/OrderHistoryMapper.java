package com.example.datn.mapper;

import com.example.datn.dto.request.OrderHistoryRequest;
import com.example.datn.dto.response.OrderHistoryResponse;
import com.example.datn.entity.OrderHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderHistoryMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "order", ignore = true)
    OrderHistory toOrderHistory(OrderHistoryRequest request);
    OrderHistoryResponse toOrderHistoryResponse(OrderHistory orderHistory);
    List<OrderHistoryResponse> toListOrderHistory(List<OrderHistory> list);
}
