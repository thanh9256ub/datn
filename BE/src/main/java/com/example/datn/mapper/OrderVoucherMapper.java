package com.example.datn.mapper;

import com.example.datn.dto.request.OrderVoucherRequest;
import com.example.datn.dto.response.OrderVoucherReponse;
import com.example.datn.entity.OrderVoucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderVoucherMapper {
    OrderVoucher toOrderVoucher(OrderVoucherRequest request);
    OrderVoucherReponse toOrderVoucherReponse(OrderVoucher orderVoucher);
    List<OrderVoucherReponse>toListReponses(List<OrderVoucher> orderVoucherList);
    @Mapping(target = "id" , ignore = true)
    void update(@MappingTarget OrderVoucher orderVoucher, OrderVoucherRequest request);
}
