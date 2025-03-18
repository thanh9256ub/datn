package com.example.datn.service;

import com.example.datn.dto.request.AddressRequest;
import com.example.datn.dto.response.AddressResponse;
import com.example.datn.entity.Address;
import com.example.datn.entity.Customer;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.AddressMapper;
import com.example.datn.repository.AddressRepository;
import com.example.datn.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    AddressMapper addressMapper;

    public List<AddressResponse> getAll() {
        List<AddressResponse> responseList = new ArrayList<>();
        addressRepository.findAll().forEach(address -> {
            responseList.add(new AddressResponse(address));
        });
        return responseList;
//        return addressMapper.toListResponses(addressRepository.findAll());
    }

    public AddressResponse creaAddress(AddressRequest addressRequest) {

        Address address = addressMapper.toAddress(addressRequest);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        Optional<Customer> customer = customerRepository.findById(addressRequest.getCustomerId());
        if (customer.isEmpty()) throw new ResourceNotFoundException("Customer is not found");
        address.setCustomer(customer.get());

        Address oldDefaultAddress = addressRepository.findAddressByCustomerIdAndStatus(customer.get().getId(), 1);
        if (Objects.isNull(oldDefaultAddress))
            address.setStatus(1);
        else if (address.getStatus() == 1) {
            oldDefaultAddress.setStatus(0);
            address.setStatus(1);
            addressRepository.save(oldDefaultAddress);
        }

        Address created = addressRepository.save(address);
        return new AddressResponse(created);

    }

    public AddressResponse getAddressById(Integer id) {

        Address address = addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address id is not exists with given id: " + id));

        return addressMapper.toAddressResponse(address);
    }

    public AddressResponse updateAddress(Integer id, AddressRequest addressRequest) {

        Address address = addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address id is not exists with given id: " + id));
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        addressMapper.updateAddress(address, addressRequest);

        return new AddressResponse(addressRepository.save(address));
    }

    public void deleteAddress(Integer id) {

        addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address id is not exists with given id: " + id));

        addressRepository.deleteById(id);
    }
}