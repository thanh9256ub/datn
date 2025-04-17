package com.example.datn.service;

import com.example.datn.dto.request.OrderDetailRequest;
import com.example.datn.dto.response.OrderDetailResponse;
import com.example.datn.entity.Order;
import com.example.datn.entity.OrderDetail;
import com.example.datn.entity.ProductDetail;
import com.example.datn.mapper.OrderDetailMapper;
import com.example.datn.repository.OrderDetailRepository;
import com.example.datn.repository.OrderRepository;
import com.example.datn.repository.ProductDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class OrderDetailService {


    @Autowired
    private OrderDetailRepository repository;

    @Autowired
    private OrderDetailMapper mapper;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductDetailService productDetailService;

    @Transactional
    public OrderDetailResponse create(OrderDetailRequest request) {
        OrderDetail orderDetail = new OrderDetail();

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));
        orderDetail.setOrder(order);

        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new RuntimeException("ProductDetail not found with id: " + request.getProductDetailId()));
        orderDetail.setProductDetail(productDetail);

        orderDetail.setQuantity(request.getQuantity());
        orderDetail.setPrice(request.getPrice());
        orderDetail.setTotalPrice(request.getTotalPrice());
        orderDetail.setStatus(request.getStatus() != null ? request.getStatus() : 0);
        orderDetail.setProductStatus(request.getProductStatus() != null ? request.getProductStatus() : 1);

        OrderDetail created = repository.save(orderDetail);
        return mapper.toOrderDetailResponse(created);
    }
    public List<OrderDetailResponse> getAll() {
        List<OrderDetail> validOrderDetails = repository.findAll().stream()
                .filter(od -> od.getOrder() != null && od.getOrder().getStatus() == 0)
                .collect(Collectors.toList());
        return mapper.toListResponses(validOrderDetails);
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


    public void updateProductQuantity(Integer productId, Integer quantity) {
        ProductDetail productDetail = productDetailRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productDetail.setQuantity(productDetail.getQuantity() - quantity);
        productDetailRepository.save(productDetail);
        productDetailService.updateTotalQuantity(productDetail.getProduct().getId());

    }
    public void updateProductDetail(Integer orderid, Integer productId, Integer quantity) {
        ProductDetail productDetail = productDetailRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
        OrderDetail orderDetail = repository.findById(orderid).orElseThrow(() -> new RuntimeException("order not found"));
        productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity() - quantity);
        productDetailRepository.save(productDetail);
        productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
    }


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
        ProductDetail productDetail=productDetailRepository.findById(productId).get();
        orderDetail.setProductDetail(productDetail);
        orderDetail.setProductDetailName(productDetail.getProduct().getProductName()+" - "+productDetail.getColor()+" - "+productDetail.getSize());
        orderDetail.setPrice(productDetailRepository.findById(productId).get().getPrice());
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity * productDetailRepository
                .findById(productId).get().getPrice());
        orderDetail.setStatus(0);
        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);


    }
    public List<OrderDetailResponse> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = repository.findByOrderId(orderId);
        return mapper.toListResponses(orderDetails);
    }
    public OrderDetailResponse updateOrderDetail(Integer orderId, Integer quantity) {
        OrderDetail orderDetail = repository.findById(orderId).orElseThrow(() -> new RuntimeException("order not found"));
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity * orderDetail.getPrice());

        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);
    }

    public OrderDetailResponse updateOrderDetail2(Integer orderId, Integer quantity) {
        OrderDetail orderDetail = repository.findById(orderId).orElseThrow(() -> new RuntimeException("order not found"));
        orderDetail.setQuantity(quantity);
        orderDetail.setTotalPrice(quantity * orderDetail.getPrice());
        orderDetail.setStatus(1);
        repository.save(orderDetail);
        return mapper.toOrderDetailResponse(orderDetail);
    }
    public void deteleOrderDetailByIdOrder (Integer id) {
        for (OrderDetail orderDetail: repository.findAll() ) {
            if (orderDetail.getOrder().getId().equals(id)){
                repository.deleteById(orderDetail.getId());
            }
        }

    }
    public void updateOrderDetail (Integer id) {
        for (OrderDetail orderDetail: repository.findAll() ) {
            if (orderDetail.getOrder().getId().equals(id)){
                ProductDetail productDetail= orderDetail.getProductDetail();
                productDetail.setQuantity(orderDetail.getQuantity()+orderDetail.getProductDetail().getQuantity());
                productDetailRepository.save(productDetail) ;
            }
        }

    }
    public List<?> getTopSellingProducts() {
        // Tạo Pageable để giới hạn số lượng kết quả trả về là 5
        Pageable pageable = PageRequest.of(0, 5); // Lấy 5 sản phẩm đầu tiên
        return repository.getTop5BestSellingProducts(pageable);
    }
    @Transactional
    public List<OrderDetailResponse> updateOrderDetails(Integer orderId, List<OrderDetailRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Danh sách chi tiết đơn hàng không được để trống");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        List<OrderDetail> currentDetails = repository.findByOrderId(orderId);
        if (order.getStatus() >= 2) { // Chỉ hoàn lại nếu đơn hàng đã ở trạng thái 2 trở lên
            for (OrderDetail detail : currentDetails) {
                ProductDetail productDetail = detail.getProductDetail();
                if (detail.getQuantity() < 0) {
                    throw new IllegalArgumentException("Invalid quantity in existing order detail: " + detail.getId());
                }
                productDetail.setQuantity(productDetail.getQuantity() + detail.getQuantity());
                productDetailRepository.save(productDetail);
                productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
            }
        }

        repository.deleteByOrderId(orderId);

        List<OrderDetail> newDetails = items.stream().map(item -> {
            ProductDetail productDetail = productDetailRepository.findById(item.getProductDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with id: " + item.getProductDetailId()));
            if (productDetail.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(String.format(
                        "Insufficient stock for product: %s. Requested: %d, Available: %d",
                        productDetail.getProduct().getProductName(), item.getQuantity(), productDetail.getQuantity()
                ));
            }

            if (order.getStatus() >= 2) {
                productDetail.setQuantity(productDetail.getQuantity() - item.getQuantity());
                productDetailRepository.save(productDetail);
                productDetailService.updateTotalQuantity(productDetail.getProduct().getId());
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProductDetail(productDetail);
            orderDetail.setQuantity(item.getQuantity());
            orderDetail.setPrice(item.getPrice() != null ? item.getPrice() : productDetail.getPrice());
            orderDetail.setTotalPrice(item.getTotalPrice() != null ? item.getTotalPrice() : item.getPrice() * item.getQuantity());
            orderDetail.setStatus(item.getStatus() != null ? item.getStatus() : 0);
            orderDetail.setProductStatus(item.getProductStatus() != null ? item.getProductStatus() : 1);

            return orderDetail;
        }).collect(Collectors.toList());

        List<OrderDetail> savedDetails = repository.saveAll(newDetails);

        double orderTotalPrice = savedDetails.stream()
                .mapToDouble(OrderDetail::getTotalPrice)
                .sum();

        order.setTotalPrice(orderTotalPrice);
        orderRepository.save(order);

        return mapper.toListResponses(savedDetails);
    }
}