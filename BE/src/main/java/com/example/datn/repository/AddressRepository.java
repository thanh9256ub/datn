package com.example.datn.repository;

import com.example.datn.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    Address findAddressByCustomerIdAndStatus(Integer customerId, Integer status);

    List<Address> findAddressByCustomerIdInAndStatus(List<Integer> customerIds, Integer status);
}