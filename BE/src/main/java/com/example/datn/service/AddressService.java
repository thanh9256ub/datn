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
        // return addressMapper.toListResponses(addressRepository.findAll());
    }

    public AddressResponse creaAddress(AddressRequest addressRequest) {

        Optional<Customer> customer = customerRepository.findById(addressRequest.getCustomerId());
        if (customer.isEmpty()) throw new ResourceNotFoundException("Customer is not found");
        Address address = new Address(addressRequest, customer.get());

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

    public List<AddressResponse> getAddressesByCustomerId(Integer customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty()) {
            throw new ResourceNotFoundException("Customer not found with id: " + customerId);
        }
        List<Address> addresses = addressRepository.findByCustomerId(customerId);
        List<AddressResponse> responseList = new ArrayList<>();
        addresses.forEach(address -> responseList.add(new AddressResponse(address)));
        return responseList;
    }

    public AddressResponse updateAddress(Integer id, AddressRequest addressRequest) {

        Address address = addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address id is not exists with given id: " + id));
        address.setUpdatedAt(LocalDateTime.now());
        address.setDetailedAddress(addressRequest.getDetailedAddress());
        address.setCity(addressRequest.getCity());
        address.setWard(addressRequest.getWard());
        address.setDistrict(addressRequest.getDistrict());
        address.setStatus(addressRequest.getStatus());
        Address oldDefaultAddress = addressRepository.findAddressByCustomerIdAndStatus(address.getCustomer().getId(), 1);
        if (Objects.isNull(oldDefaultAddress))
            address.setStatus(1);
        else if (address.getStatus() == 1) {
            oldDefaultAddress.setStatus(0);
            address.setStatus(1);
            addressRepository.save(oldDefaultAddress);
        }

        return new AddressResponse(addressRepository.save(address));
    }

    public void deleteAddress(Integer id) {

        addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address id is not exists with given id: " + id));

        addressRepository.deleteById(id);
    }

    public AddressResponse setDefaultAddress(Integer id) {
        // Tìm địa chỉ theo id
        Address address = addressRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Address not found with id: " + id));

        // Lấy customerId từ địa chỉ
        Integer customerId = address.getCustomer().getId();

        // Tìm tất cả địa chỉ của khách hàng và đặt status = 0
        List<Address> customerAddresses = addressRepository.findByCustomerId(customerId);
        for (Address addr : customerAddresses) {
            if (!addr.getId().equals(id)) {
                addr.setStatus(0);
                addr.setUpdatedAt(LocalDateTime.now());
                addressRepository.save(addr);
            }
        }

        // Đặt địa chỉ được chọn làm mặc định
        address.setStatus(1);
        address.setUpdatedAt(LocalDateTime.now());
        Address updatedAddress = addressRepository.save(address);

        return new AddressResponse(updatedAddress);
    }
}