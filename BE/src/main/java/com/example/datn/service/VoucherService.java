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
import java.util.Random;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherMapper mapper;

    public List<VoucherRespone> getAll(){
        return mapper.listVoucher(voucherRepository.findAll());
    }

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final int CODE_LENGTH = 12;

    public String generateUniqueVoucher() {
        String code;
        do {
            code = generateRandomCode();
        } while (voucherRepository.findByVoucherCode(code).isPresent()); // Kiểm tra trùng lặp

        return code;
    }

    private String generateRandomCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }


    public VoucherRespone createVoucher(VoucherRequest request){

        Voucher voucher = mapper.voucher(request);

        System.out.println("Trước khi sinh mã: " + voucher.getVoucherCode());

        voucher.setVoucherCode(generateUniqueVoucher());

        System.out.println("Sau khi sinh mã: " + voucher.getVoucherCode());

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

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher không tồn tại với ID: " + id));
        voucher.setStatus("Đã xóa");
        voucherRepository.save(voucher);
    }
}