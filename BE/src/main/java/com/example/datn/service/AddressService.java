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
import java.util.List;

@Service
public class AddressService {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    AddressMapper addressMapper;

    public List<AddressResponse> getAll() {

        return addressMapper.toListResponses(addressRepository.findAll());
    }

    public AddressResponse creAddress(AddressRequest addressRequest) {

        Address address = addressMapper.toAddress(addressRequest);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        Customer customer = customerRepository.findById(addressRequest.getCustomerId()).get();
        address.setCustomer(customer);

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
