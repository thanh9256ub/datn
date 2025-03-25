package com.example.datn.repository;

import com.example.datn.dto.response.AddressResponse;
import com.example.datn.entity.Address;
import com.example.datn.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT c FROM Customer c " +
            "WHERE LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))" +
            "OR LOWER(c.fullName) LIKE LOWER(concat('%', :search, '%'))")
    Page<Customer> searchCustomer(@Param("search") String search,
                                  Pageable pageable);
}