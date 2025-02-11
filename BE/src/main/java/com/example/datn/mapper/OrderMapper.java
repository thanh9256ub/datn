package com.example.datn.mapper;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "updatedAt",ignore = true)
    @Mapping(target = "customer",ignore = true)
    @Mapping(target = "employee",ignore = true)
    @Mapping(target = "paymentType",ignore = true)
    @Mapping(target = "paymentMethod",ignore = true)
    Order toOrder(OrderRequest request);

    @Mapping(target = "customer",source = "customer.")
    @Mapping(target = "employee",source = "")
    @Mapping(target = "paymentType",source = "")
    @Mapping(target = "paymentMethod",source = "")
    OrderResponse toOrderResponse(Order order);

    void updateOrder(@MappingTarget Order order, OrderRequest orderRequest);
}
