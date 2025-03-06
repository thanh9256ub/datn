package com.example.datn.repository;

import com.example.datn.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    Address findAddressByCustomerIdAndDefaultAddress(Integer customerId, Boolean defaultAddress);

    List<Address> findAddressByCustomerIdInAndDefaultAddress(List<Integer> customerIds, Boolean defaultAddress);
}
