package com.example.datn.service;

import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.response.ApiPagingResponse;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.entity.Customer;
import com.example.datn.entity.Role;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CustomerMapper;
import com.example.datn.repository.AddressRepository;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    CustomerMapper customerMapper;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    AddressRepository addressRepository;

    public ApiPagingResponse<List<CustomerResponse>> getAll(String search, int page, int pageSize) {

        List<CustomerResponse> responseList = new ArrayList<>();

        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.Direction.DESC, "createdAt");
        Page<Customer> customerPage;
        if (search == null) search = "";

        customerPage = customerRepository.searchCustomer(search.trim(), pageable);

        customerPage.get().forEach(customer -> responseList.add(new CustomerResponse(customer)));

        return new ApiPagingResponse<>(
                HttpStatus.OK.value(),
                "Customer retrieved successfully",
                responseList,
                customerPage.getTotalPages()

        );
//        customerRepository.findAll().forEach(customer -> {
//            responseList.add(new CustomerResponse(customer));
//        });
//        return responseList;
//        return customerMapper.toListResponse(customerRepository.findAll());
    }

    public CustomerResponse creatCustomer(CustomerRequest customerRequest) {

        Customer customer = customerMapper.toCustomer(customerRequest);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        Role role = roleRepository.findById(1).get();
        customer.setRole(role);

        Customer created = customerRepository.save(customer);

        return new CustomerResponse(created);
    }

    public CustomerResponse getCustomerById(Integer id) {

        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        return customerMapper.toCustomerResponse(customer);
    }

    public CustomerResponse updateCustomer(Integer id, CustomerRequest customerRequest) {

        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        customerMapper.updateCustomer(customer, customerRequest);

        return customerMapper.toCustomerResponse(customerRepository.save(customer));

    }

    public void deleteCustomer(Integer id) {

        customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        customerRepository.deleteById(id);
    }

}
