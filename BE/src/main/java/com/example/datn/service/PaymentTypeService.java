package com.example.datn.service;

import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.PaymentType;
import com.example.datn.mapper.PaymentTypeMapper;
import com.example.datn.repository.PaymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentTypeService {
    @Autowired
    PaymentTypeRepository paymentTypeRepository;

    @Autowired
    PaymentTypeMapper paymentTypeMapper;

    public PaymentTypeResponse createPaymentType(PaymentTypeRequest request) {
        PaymentType paymentType = paymentTypeMapper.toPaymentType(request);
        PaymentType created = paymentTypeRepository.save(paymentType);
        return paymentTypeMapper.toPaymentTypeResponse(created);
    }

    public List<PaymentTypeResponse> getAll() {
        return paymentTypeMapper.toListResponses(paymentTypeRepository.findAll());
    }

    public PaymentTypeResponse getPaymentTypeById(Integer id) {
        PaymentType paymentType = paymentTypeRepository.findById(id).get();
        return paymentTypeMapper.toPaymentTypeResponse(paymentType);
    }

    public PaymentTypeResponse updatePaymentType(Integer id, PaymentTypeRequest paymentTypeRequest) {
        PaymentType paymentType = paymentTypeRepository.findById(id).get();
        paymentTypeMapper.updatePaymentType(paymentType, paymentTypeRequest);
        return paymentTypeMapper.toPaymentTypeResponse(paymentTypeRepository.save(paymentType));
    }
    public void detelePaymentType(Integer id){
        paymentTypeRepository.deleteById(id);
    }
}
