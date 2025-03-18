package com.example.datn.mapper;

import com.example.datn.dto.request.AddressRequest;
import com.example.datn.dto.response.AddressResponse;
import com.example.datn.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    Address toAddress(AddressRequest request);

    AddressResponse toAddressResponse(Address address);

    List<AddressResponse> toListResponses(List<Address> list);

    @Mapping(target = "id", ignore = true)
    void updateAddress(@MappingTarget Address address, AddressRequest addressRequest);
}