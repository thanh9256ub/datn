package com.example.datn.service;

import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.request.PaymentTypeRequest;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.PaymentType;
import com.example.datn.mapper.OrderMapper;
import com.example.datn.mapper.PaymentTypeMapper;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.EmployeeRepository;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.PaymentMethodRepository;
import com.example.datn.repository.PaymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository repository;
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    OrderMapper mapper;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    PaymentMethodRepository paymentMethodRepository;
    @Autowired
    PaymentTypeRepository paymentTypeRepository;

    public OrderResponse create(OrderRequest request) {
        int i = getAll().size();
        Order order = mapper.toOrder(request);
        order.setOrderCode("HD" + (i + 1));

        order.setEmployee(employeeRepository.findById(request.getEmployeeId()).get());
        Order created = repository.save(order);
        return mapper.toOrderResponse(created);
    }

    public List<OrderResponse> getAll() {
        return mapper.toListOrders(repository.findAllWithPaymentDetails());
    }

    public OrderResponse updateStatus(Integer id, int newStatus) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(newStatus);
        Order updatedOrder = repository.save(order);
        return mapper.toOrderResponse(updatedOrder);
    }

    public OrderResponse getById(Integer id) {
        Order order = repository.findById(id).get();
        return mapper.toOrderResponse(order);
    }

    public OrderResponse update(Integer id, OrderRequest orderRequest) {
        Order order = repository.findById(id).get();

        if (orderRequest.getStatus()!=null&&orderRequest.getStatus()==1){
            order.setStatus(orderRequest.getStatus());
            return mapper.toOrderResponse(repository.save(order));
        }
        if (orderRequest.getCustomerId() != null) {
            order.setCustomer(customerRepository.findById(orderRequest.getCustomerId()).get());
        }
        order.setCustomerName(orderRequest.getCustomerName());
        order.setPhone(orderRequest.getPhone());
        order.setAddress(orderRequest.getAddress());
        order.setNote(orderRequest.getNote());
        order.setShippingFee(orderRequest.getShippingFee());
        order.setDiscountValue(orderRequest.getDiscountValue());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setTotalPayment(orderRequest.getTotalPayment());
        order.setPaymentType(paymentTypeRepository.findById(orderRequest.getPaymentTypeId()).get());
        order.setPaymentMethod(paymentMethodRepository.findById(orderRequest.getPaymentMethodId()).get());
        order.setUpdatedAt(LocalDateTime.now().withNano(0));
        if (orderRequest.getPaymentMethodId().equals(2)){
            order.setStatus(2);
        }else{
            order.setStatus(3);
        }

        return mapper.toOrderResponse(repository.save(order));
    }


    public void detele(Integer id) {
        repository.deleteById(id);
    }
}