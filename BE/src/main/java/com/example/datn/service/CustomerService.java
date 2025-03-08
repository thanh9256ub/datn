package com.example.datn.service;

import com.example.datn.dto.request.AddressRequest;
import com.example.datn.dto.request.CustomerRequest;
import com.example.datn.dto.response.ApiPagingResponse;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.entity.Address;
import com.example.datn.entity.Customer;
import com.example.datn.entity.Role;
import com.example.datn.exception.DataInvalidException;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CustomerMapper;
import com.example.datn.repository.AddressRepository;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.RoleRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
        boolean addressIsEmpty = Objects.isNull(customerRequest.getAddress())
                || customerRequest.getAddress().isEmpty();
        if (!addressIsEmpty) {
            int totalDefaultAddress = 0;
            for (AddressRequest address : customerRequest.getAddress()) {
                if (address.getDefaultAddress()) totalDefaultAddress++;
            }
            if (totalDefaultAddress > 1) throw new DataInvalidException("Quá nhiều địa chỉ mặc định");
        }

        Customer customer = customerMapper.toCustomer(customerRequest);
        customer.setCustomerCode("KH.....");
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        Role role = roleRepository.findById(1).get();
        customer.setRole(role);

        Customer created = customerRepository.save(customer);
        created.setCustomerCode(generateCustomerCode(created.getId()));
        customerRepository.save(created);
        List<Address> addressList = new ArrayList<>();
        if (!addressIsEmpty) {
            for (AddressRequest address : customerRequest.getAddress()) {
                if (StringUtils.isNotBlank(address.getCity()))
                    addressList.add(new Address(address, created));
            }
            addressRepository.saveAll(addressList);
        }
        created.setAddressList(addressList);
        return new CustomerResponse(created);
    }

    public CustomerResponse getCustomerById(Integer id) {

        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        return new CustomerResponse(customer);
//        return customerMapper.toCustomerResponse(customer);
    }

    public CustomerResponse updateCustomer(Integer id, CustomerRequest customerRequest) {

        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        customer.setBirthDate(LocalDate.parse(customerRequest.getBirthDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        customer.setEmail(customerRequest.getEmail());
        customer.setGender(customerRequest.getGender());
        customer.setFullName(customerRequest.getFullName());
        customer.setPhone(customerRequest.getPhone());
        customer.setUpdatedAt(LocalDateTime.now());

        return customerMapper.toCustomerResponse(customerRepository.save(customer));

    }

    public void deleteCustomer(Integer id) {

        customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Customer id is not exists with given id: " + id)
        );

        customerRepository.deleteById(id);
    }

    private String generateCustomerCode(Integer id) {
        return String.format("KH%05d", id);
    }
}
