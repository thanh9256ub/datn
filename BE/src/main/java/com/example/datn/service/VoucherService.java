package com.example.datn.service;

import com.example.datn.controller.WebSocketController;
import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.VoucherResponse;
import com.example.datn.entity.Voucher;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.VoucherMapper;
import com.example.datn.repository.VoucherRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
public class VoucherService {

    @Autowired
    VoucherRepository voucherRepository;

    @Autowired
    private VoucherMapper mapper;

    @Autowired
    private WebSocketController webSocketController;

    public List<VoucherResponse> getAll() {
        return mapper.listResponse(voucherRepository.findAll());
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void updateVoucherStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll();
        List<Voucher> updatedVouchers = new ArrayList<>();

        for (Voucher v : vouchers) {
            Integer oldStatus = v.getStatus();
            Integer newStatus = (v.getStartDate().isBefore(now) && v.getEndDate().isAfter(now)) ? 1 :
                    (v.getEndDate().isBefore(now)) ? 0 : 2;

            if (!oldStatus.equals(newStatus)) {
                v.setStatus(newStatus);
                updatedVouchers.add(v);
                // Gửi thông báo chỉ với mã voucher
                webSocketController.sendVoucherUpdate(v.getVoucherCode());
                log.info("Voucher {} updated from status {} to {}", v.getVoucherCode(), oldStatus, newStatus);
            }
        }

        if (!updatedVouchers.isEmpty()) {
            voucherRepository.saveAll(updatedVouchers);
            log.info("Saved {} updated vouchers", updatedVouchers.size());
        }
    }

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final int CODE_LENGTH = 12;

    public String generateUniqueVoucher() {
        String code;
        do {
            code = generateRandomCode();
        } while (voucherRepository.findByVoucherCode(code).isPresent());

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


    public VoucherResponse createVoucher(VoucherRequest request) {

        if (request.getDiscountType() == 0) {
            request.setMaxDiscountValue(null);
        } else {
            if (request.getDiscountValue() < 1 || request.getDiscountValue() > 100) {
                throw new IllegalArgumentException("Giá trị giảm phải từ 1-100%");
            }
        }

        Voucher voucher = mapper.voucher(request);

        voucher.setVoucherCode(generateUniqueVoucher());

        Voucher created = voucherRepository.save(voucher);

        return mapper.voucherResponse(created);
    }

    public VoucherResponse getVoucherById(Integer id) {

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        return mapper.voucherResponse(voucher);
    }

    public VoucherResponse updateVoucher(Integer id, VoucherRequest request) {

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        mapper.updateVoucher(voucher, request);

        return mapper.voucherResponse(voucherRepository.save(voucher));
    }

}