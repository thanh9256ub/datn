package com.example.datn.mapper;


import com.example.datn.dto.request.PaymentMethodRequest;
import com.example.datn.dto.response.PaymentMethodResponse;
import com.example.datn.entity.PaymentMethod;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")

public interface PaymentMethodMapper {

    PaymentMethod toPaymentMethod(PaymentMethodRequest request);

    PaymentMethodResponse toPaymentMethodResponse(PaymentMethod paymentMethod);

    List<PaymentMethodResponse> toListReaponses(List<PaymentMethod> listPaymentMethods);

    @Mapping(target = "id", ignore = true)
    void updatePaymentMethod(@MappingTarget PaymentMethod paymentMethod, PaymentMethodRequest request);

}