package com.example.datn.service;

import com.example.datn.dto.request.*;
import com.example.datn.dto.response.CustomerResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.dto.response.PaymentTypeResponse;
import com.example.datn.entity.*;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.OrderMapper;
import com.example.datn.mapper.PaymentTypeMapper;
import com.example.datn.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PaymentTypeRepository paymentTypeRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderMapper mapper;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    public OrderResponse create(OrderRequest request) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmssS");


        Order order = mapper.toOrder(request);
        order.setOrderCode("HD" + sdf.format(new Date()));

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

        if (orderRequest.getStatus() != null && orderRequest.getStatus() == 1) {
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
        if (orderRequest.getPaymentTypeId().equals(2)) {
            order.setStatus(2);
        } else {
            order.setStatus(3);
        }

        return mapper.toOrderResponse(repository.save(order));
    }
    public List<OrderResponse> filterOrders(
            String orderCode,
            Double minPrice,
            Double maxPrice,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Integer status) {

        try {
            System.out.println("Filtering orders with params:");
            System.out.println("orderCode: " + orderCode);
            System.out.println("minPrice: " + minPrice);
            System.out.println("maxPrice: " + maxPrice);
            System.out.println("startDate: " + startDate);
            System.out.println("endDate: " + endDate);
            System.out.println("status: " + status);

            List<Order> filteredOrders = repository.filterOrders(
                    orderCode, minPrice, maxPrice, startDate, endDate, status
            );

            System.out.println("Found " + filteredOrders.size() + " orders");
            return mapper.toListOrders(filteredOrders);
        } catch (Exception e) {
            System.err.println("Error filtering orders: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    public OrderResponse updateCustomerInfo(Integer orderId, CustomerInfoRequest request) {
        System.out.println("Updating customer info for order: " + orderId);
        System.out.println("New customer info: " + request.toString());

        Order order = repository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());

        Order updatedOrder = repository.save(order);
        System.out.println("Updated order: " + updatedOrder.toString());

        return mapper.toOrderResponse(updatedOrder);
    }

    public void detele(Integer id) {
        repository.deleteById(id);
    }

    @Transactional
    public OrderResponse createOrderFromCart(Integer cartId, OrderRequest orderRequest) {
        Cart cart = cartService.getOrCreateCart(cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart not found with id: " + cartId);
        }

        Order order = new Order();
        order.setOrderCode(orderRequest.getOrderCode() != null ? orderRequest.getOrderCode() : "ORD" + System.currentTimeMillis());

        if (orderRequest.getCustomerId() != null) {
            Customer customer = customerRepository.findById(orderRequest.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            order.setCustomer(customer);
        }

        order.setCustomerName(orderRequest.getCustomerName());
        order.setPhone(orderRequest.getPhone());
        order.setAddress(orderRequest.getAddress());
        order.setNote(orderRequest.getNote());
        order.setShippingFee(orderRequest.getShippingFee() != null ? orderRequest.getShippingFee() : 0.0);
        order.setDiscountValue(orderRequest.getDiscountValue() != null ? orderRequest.getDiscountValue() : 0.0);

        Double totalPrice = orderRequest.getTotalPrice() != null ? orderRequest.getTotalPrice() : cart.getTotal_price();
        order.setTotalPrice(totalPrice);
        order.setTotalPayment(totalPrice + order.getShippingFee() - order.getDiscountValue());

        if (orderRequest.getPaymentTypeId() != null) {
            PaymentType paymentType = paymentTypeRepository.findById(orderRequest.getPaymentTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("PaymentType not found"));
            order.setPaymentType(paymentType);
        }
        if (orderRequest.getPaymentMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(orderRequest.getPaymentMethodId())
                    .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
            order.setPaymentMethod(paymentMethod);
        }

        order.setOrderType(orderRequest.getOrderType());
        order.setStatus(orderRequest.getStatus());
        order.setCreatedAt(orderRequest.getCreatedAt() != null ? orderRequest.getCreatedAt() : LocalDateTime.now().withNano(0));
        order.setUpdatedAt(orderRequest.getUpdatedAt() != null ? orderRequest.getUpdatedAt() : LocalDateTime.now().withNano(0));

        order = repository.save(order);

        List<OrderRequest.CartItemDTO> cartItems = orderRequest.getCartItems();
        if (cartItems != null && !cartItems.isEmpty()) {
            for (OrderRequest.CartItemDTO item : cartItems) {
                OrderDetailRequest orderDetailRequest = new OrderDetailRequest(
                        order.getId(),
                        item.getProductDetailId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getTotalPrice(),
                        1,
                        1
                );
                orderDetailService.create(orderDetailRequest); // Thay create bằng createV2
                orderDetailService.updateProductQuantity(item.getProductDetailId(), item.getQuantity());
            }
        } else {
            List<CartDetails> cartDetailsList = cart.getItems();
            if (cartDetailsList == null || cartDetailsList.isEmpty()) {
                throw new ResourceNotFoundException("Cart is empty, cannot create order");
            }
            for (CartDetails cartDetail : cartDetailsList) {
                OrderDetailRequest orderDetailRequest = new OrderDetailRequest(
                        order.getId(),
                        cartDetail.getProductDetail().getId(),
                        cartDetail.getQuantity(),
                        cartDetail.getPrice(),
                        cartDetail.getTotal_price(),
                        1,
                        1
                );
                orderDetailService.create(orderDetailRequest); // Thay create bằng createV2
                orderDetailService.updateProductQuantity(cartDetail.getProductDetail().getId(), cartDetail.getQuantity());
            }
        }

        cart.setStatus(2);
        cartService.updateCart(cart.getId(), new CartRequest(
                cart.getCustomer().getId(),
                cart.getTotal_price(),
                cart.getCreated_at(),
                2
        ));

        return mapper.toOrderResponse(order);
    }
    @Transactional
    public OrderResponse createOrderForGuest(GuestOrderRequest request) {
        Order order = new Order();
        order.setOrderCode("GUEST" + System.currentTimeMillis());
        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setNote(request.getNote());
        order.setShippingFee(request.getShippingFee() != null ? request.getShippingFee() : 0.0);
        order.setDiscountValue(request.getDiscountValue() != null ? request.getDiscountValue() : 0.0);
        order.setTotalPrice(request.getTotalPrice());
        order.setTotalPayment(request.getTotalPayment());

        if (request.getPaymentTypeId() != null) {
            PaymentType paymentType = paymentTypeRepository.findById(request.getPaymentTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("PaymentType not found"));
            order.setPaymentType(paymentType);
        }
        if (request.getPaymentMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                    .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
            order.setPaymentMethod(paymentMethod);
        }

        order.setOrderType(request.getOrderType());
        order.setStatus(request.getStatus());
        order.setCreatedAt(LocalDateTime.now().withNano(0));
        order.setUpdatedAt(LocalDateTime.now().withNano(0));

        order = repository.save(order);

        for (GuestOrderRequest.CartItemDTO item : request.getCartItems()) {
            OrderDetailRequest orderDetailRequest = new OrderDetailRequest(
                    order.getId(),
                    item.getProductDetailId(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getTotal_price(),
                    1,
                    1
            );
            orderDetailService.create(orderDetailRequest); // Thay create bằng createV2
            orderDetailService.updateProductQuantity(item.getProductDetailId(), item.getQuantity());
        }

        return mapper.toOrderResponse(order);
    }
}