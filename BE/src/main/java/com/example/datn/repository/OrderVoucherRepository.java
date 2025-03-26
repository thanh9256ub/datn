package com.example.datn.repository;

import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.OrderVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderVoucherRepository extends JpaRepository<OrderVoucher , Integer> {

}
