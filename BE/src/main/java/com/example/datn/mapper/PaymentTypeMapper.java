package com.example.datn.mapper;

import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.PaymentType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentTypeMapper {

    PaymentType toPaymentType(PaymentTypeRequest request);

    PaymentTypeResponse toPaymentTypeResponse(PaymentType paymentType);

    List<PaymentTypeResponse> toListResponses(List<PaymentType> listPaymentTypes);

    @Mapping(target = "id",ignore = true)
    void updatePaymentType(@MappingTarget PaymentType paymentType, PaymentTypeRequest request);
}
