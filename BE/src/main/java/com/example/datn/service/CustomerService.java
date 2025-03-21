package com.example.datn.service;

import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.entity.Customer;
import com.example.datn.entity.Role;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CustomerMapper;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    CustomerMapper customerMapper;

    @Autowired
    RoleRepository roleRepository;

    public List<CustomerResponse> getAll() {

        return customerMapper.toListResponse(customerRepository.findAll());
    }

    public CustomerResponse creatCustomerT(CustomerRequest customerRequest) {
        int i = getAll().size();
        Customer customer = customerMapper.toCustomer(customerRequest);
        customer.setCreatedAt(LocalDateTime.now().withNano(0));
        customer.setUpdatedAt(LocalDateTime.now().withNano(0));
        customer.setRoLe(roleRepository.findById(1).get());
        customer.setCustomerCode("KH" + (i + 1));
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
