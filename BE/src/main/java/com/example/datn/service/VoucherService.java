package com.example.datn.service;

import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.VoucherRespone;
import com.example.datn.entity.Voucher;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.VoucherMapper;
import com.example.datn.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherMapper mapper;

    public List<VoucherRespone> getAll(){
        return mapper.listVoucher(voucherRepository.findAll());
    }

    public VoucherRespone createVoucher(VoucherRequest request){

        Voucher voucher = mapper.voucher(request);

        Voucher created = voucherRepository.save(voucher);

        return mapper.voucherRepson(created);
    }

    public VoucherRespone getVoucherById(Integer id){

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        return mapper.voucherRepson(voucher);
    }

    public VoucherRespone updateVoucher(Integer id, VoucherRequest request){

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        mapper.updateVoucher( voucher, request);

        return mapper.voucherRepson(voucherRepository.save(voucher));
    }

    public void deleteVoucher(Integer id){

        voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category id is not exists with given id: " + id));

        voucherRepository.deleteById(id);
    }
}
