package com.example.datn.mapper;

import com.example.datn.dto.request.CartDetailsRequest;
import com.example.datn.dto.response.CartDetailsResponse;
import com.example.datn.entity.CartDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartDetailsMapper {
    CartDetails toCartDetails(CartDetailsRequest request);

    CartDetailsResponse toCartDetailsResponse(CartDetails cartDetails);

    List<CartDetailsResponse> toListResponse(List<CartDetails> list);

    @Mapping(target = "id", ignore = true)
    void updateCartDetails(@MappingTarget CartDetails cartDetails, CartDetailsRequest request);
}
