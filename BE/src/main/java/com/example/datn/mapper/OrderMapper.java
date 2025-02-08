package com.example.datn.mapper;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface OrderMapper {

    Order toEntity(OrderRequest request);

    OrderResponse toResponse(Order order);

    void updateEntity(@MappingTarget Order order, OrderRequest request);

}
