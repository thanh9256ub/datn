package com.example.datn.service;

import com.example.datn.dto.request.PaymentMethodRequest;
import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.PaymentMethodResponse;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.PaymentMethod;
import com.example.datn.entity.PaymentType;
import com.example.datn.mapper.PaymentMethodMapper;
import com.example.datn.mapper.PaymentTypeMapper;
import com.example.datn.repository.PaymentMethodRepository;
import com.example.datn.repository.PaymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodService {
    @Autowired
    PaymentMethodRepository repository;

    @Autowired
    PaymentMethodMapper mapper;

    public PaymentMethodResponse createPaymentMethod(PaymentMethodRequest request) {
        PaymentMethod paymentMethod = mapper.toPaymentMethod(request);
        PaymentMethod created = repository.save(paymentMethod);
        return mapper.toPaymentMethodResponse(created);
    }

    public List<PaymentMethodResponse> getAll() {
        return mapper.toListReaponses(repository.findAll());
    }

    public PaymentMethodResponse getPaymentMethodById(Integer id) {
        PaymentMethod paymentMethod = repository.findById(id).get();
        return mapper.toPaymentMethodResponse(paymentMethod);
    }

    public PaymentMethodResponse updatePaymentMethod(Integer id, PaymentMethodRequest paymentMethodRequest) {
        PaymentMethod paymentMethod = repository.findById(id).get();
        mapper.updatePaymentMethod(paymentMethod, paymentMethodRequest);
        return mapper.toPaymentMethodResponse(repository.save(paymentMethod));
    }

    public void detelePaymentMethod(Integer id) {
        repository.deleteById(id);
    }
}