package com.example.datn.repository;

import com.example.datn.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher,Integer> {
    Optional<Voucher> findByVoucherCode(String voucherCode);

    List<Voucher> findByStatus(Integer status);

    List<Voucher> findByStatusNot(Integer status);

}
