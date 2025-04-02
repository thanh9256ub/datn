package com.example.datn.mapper;

import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    Cart toCart(CartRequest request);

    CartResponse toCartResponse(Cart cart);

    List<CartResponse> toListResponse(List<Cart> list);

    @Mapping(target = "id", ignore = true)
    void updateCart(@MappingTarget Cart cart, CartRequest request);
}
