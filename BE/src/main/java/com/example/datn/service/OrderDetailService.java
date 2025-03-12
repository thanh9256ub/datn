package com.example.datn.service;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.ProductDetail;
import com.example.datn.mapper.OrderDetailMapper;
import com.example.datn.repository.OrderDetailRepository;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class OrderDetailService {

    @Autowired
    OrderDetailRepository repository;

    @Autowired
    OrderDetailMapper mapper;

    public OrderDetailResponse create(OrderDetailRequest request) {
        OrderDetail orderDetail = mapper.toOrderDetails(request);
        OrderDetail created = repository.save(orderDetail);
        return mapper.toOrderDetailResponse(created);
    }

    public List<OrderDetailResponse> getAll() {
        return mapper.toListResponses(repository.findAll());
    }

    public OrderDetailResponse getById(Integer id) {
        OrderDetail orderDetail = repository.findById(id).get();
        return mapper.toOrderDetailResponse(orderDetail);
    }

    public OrderDetailResponse update(Integer id, OrderDetailRequest orderDetailRequest) {
        OrderDetail orderDetail = repository.findById(id).get();
        mapper.update(orderDetail, orderDetailRequest);
        return mapper.toOrderDetailResponse(repository.save(orderDetail));
    }

    public void detele(Integer id) {
        repository.deleteById(id);
    }

    @Autowired
    private ProductDetailRepository productDetailRepository;
    public List<OrderDetailResponse> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = repository.findByOrderId(orderId);
        return mapper.toListResponses(orderDetails);
    }
@Autowired
private ProductDetailService productDetailService;

    public void updateProductQuantity(Integer productId, Integer quantity) {
        ProductDetail productDetail = productDetailRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productDetail.setQuantity(productDetail.getQuantity() - quantity);
        productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
        productDetailRepository.save(productDetail);
    }

    public void updateProductDetail(Integer orderid, Integer productId, Integer quantity) {
        ProductDetail productDetail = productDetailRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
        OrderDetail orderDetail = repository.findById(orderid).orElseThrow(() -> new RuntimeException("order not found"));
        productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity() - quantity);
        productDetailRepository.save(productDetail);
    }

    @Autowired
    OrderRepository orderRepository;

    public OrderDetailResponse updateOrAddOrderDetail(Integer orderId, Integer productId, Integer quantity) {
        for (OrderDetail o : repository.findAll()) {
            if (o.getOrder().getId().equals(orderId) && o.getProductDetail().getId().equals(productId)) {
                o.setQuantity(o.getQuantity() + quantity);
                o.setTotalPrice(o.getQuantity() * o.getPrice());
                o.setStatus(0);
                repository.save(o);
                return mapper.toOrderDetailResponse(o);
            }
        }

        OrderDetail orderDetail = new OrderDetail();

        orderDetail.setOrder(orderRepository.findById(orderId).get());
        orderDetail.setProductDetail(productDetailRepository.findById(productId).get());
        orderDetail.setPrice(productDetailRepository.findById(productId).get().getPrice());
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity * productDetailRepository
                .findById(productId).get().getPrice());
        orderDetail.setStatus(0);
        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);


    }

    public OrderDetailResponse updateOrderDetail(Integer orderId, Integer quantity) {
        OrderDetail orderDetail = repository.findById(orderId).orElseThrow(() -> new RuntimeException("order not found"));
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity*orderDetail.getPrice());

        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);
    }
    public OrderDetailResponse updateOrderDetail2(Integer orderId, Integer quantity) {
        OrderDetail orderDetail = repository.findById(orderId).orElseThrow(() -> new RuntimeException("order not found"));
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity*orderDetail.getPrice());
        orderDetail.setStatus(1);
        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);
    }
}
