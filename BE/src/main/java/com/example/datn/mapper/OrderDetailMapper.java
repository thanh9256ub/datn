package com.example.datn.mapper;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {

    OrderDetail toOrderDetails(OrderDetailRequest request);

    OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);

    List<OrderDetailResponse> toListResponses(List<OrderDetail> listOrderDetail);

    @Mapping(target = "id",ignore = true)
    void update(@MappingTarget OrderDetail orderDetail, OrderDetailRequest request);

}