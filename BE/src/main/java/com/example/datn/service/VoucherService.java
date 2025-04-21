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
import java.util.stream.Collectors;

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
        return mapper.listResponse(voucherRepository.findByStatusNot(4));
    }

    public List<VoucherResponse> getActive() {
        return mapper.listResponse(voucherRepository.findByStatus(1));
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void updateVoucherStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll();
        List<Voucher> updatedVouchers = new ArrayList<>();

        for (Voucher v : vouchers) {
            // Bỏ qua các voucher đã bị xóa (status = 4)
            if (v.getStatus() == 4) {
                continue;
            }

            Integer oldStatus = v.getStatus();
            Integer newStatus;

            // Kiểm tra nếu voucher đang hoạt động (status = 1) và hết số lượng
            if (v.getStatus() == 1 && v.getQuantity() <= 0) {
                newStatus = 3; // Chuyển sang trạng thái hết số lượng
            } else {
                // Kiểm tra thời gian như bình thường cho các trường hợp khác
                newStatus = (v.getStartDate().isBefore(now) && v.getEndDate().isAfter(now)) ? 1 :
                        (v.getEndDate().isBefore(now)) ? 0 : 2;
            }

            // Chỉ cập nhật nếu trạng thái thay đổi
            if (!oldStatus.equals(newStatus)) {
                v.setStatus(newStatus);
                updatedVouchers.add(v);
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
            request.setMaxDiscountValue(request.getDiscountValue());
        } else {
            if (request.getDiscountValue() < 1 || request.getDiscountValue() > 100) {
                throw new IllegalArgumentException("Giá trị giảm phải từ 1-100%");
            }
        }

        Voucher voucher = mapper.voucher(request);

        voucher.setVoucherCode(generateUniqueVoucher());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscountValue(request.getMaxDiscountValue());
        Voucher created = voucherRepository.save(voucher);

        return mapper.voucherResponse(created);
    }

    public VoucherResponse getVoucherById(Integer id) {

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        return mapper.voucherResponse(voucher);
    }

    public List<VoucherResponse> getBin() {
        List<Voucher> vouchers = voucherRepository.findByStatus(4);

        return mapper.listResponse(vouchers);
    }

    public VoucherResponse updateVoucher(Integer id, VoucherRequest request) {

        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Voucher id is not exists with given id: " + id));

        mapper.updateVoucher(voucher, request);

        return mapper.voucherResponse(voucherRepository.save(voucher));
    }


    public void updateVoucherStatus0() {
        for (Voucher voucher : voucherRepository.findAll()) {
            if (voucher.getQuantity() == 0 && voucher.getStatus() == 1) {
                voucher.setStatus(3);
                voucherRepository.save(voucher);
            }
        }

    }

    public VoucherResponse getVoucherByCode(String voucherCode) {
        Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + voucherCode));

        return mapper.voucherResponse(voucher);
    }

    public List<VoucherResponse> deleteOrRestoreVoucher(List<Integer> vcIds) {
        LocalDateTime now = LocalDateTime.now();

        List<Voucher> vouchers = voucherRepository.findAllById(vcIds);

        for (Voucher v : vouchers) {
            if (v.getStatus() != 4) {
                // Xóa voucher (chuyển sang status = 4)
                v.setStatus(4);
            } else {
                // Khôi phục voucher
                Integer restoredStatus;

                // Kiểm tra thời gian để xác định status
                if (v.getStartDate().isBefore(now) && v.getEndDate().isAfter(now)) {
                    // Nếu trong thời gian hoạt động
                    restoredStatus = (v.getQuantity() <= 0) ? 3 : 1; // Kiểm tra số lượng
                } else if (v.getEndDate().isBefore(now)) {
                    // Nếu đã hết hạn
                    restoredStatus = 0;
                } else {
                    // Nếu chưa đến thời gian hoạt động
                    restoredStatus = 2;
                }

                v.setStatus(restoredStatus);
            }
        }

        List<Voucher> savedVouchers = voucherRepository.saveAll(vouchers);

        return savedVouchers.stream()
                .map(mapper::voucherResponse)
                .collect(Collectors.toList());
    }
}
