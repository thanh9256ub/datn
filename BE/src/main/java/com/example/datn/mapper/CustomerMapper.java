package com.example.datn.mapper;

import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    Customer toCustomer(CustomerRequest customerRequest);

    CustomerResponse toCustomerResponse(Customer customer);

    List<CustomerResponse> toListResponse(List<Customer> list);

    @Mapping(target = "id",ignore = true)
    void updateCustomer(@MappingTarget Customer customer, CustomerRequest customerRequest);

}
