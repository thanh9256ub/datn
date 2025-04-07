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
    private CartRepository cartRepository;
    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderMapper mapper;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    public OrderResponse create(OrderRequest request) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmssS");


        Order order = mapper.toOrder(request);
        order.setOrderCode("HD" + sdf.format(new Date()));

        order.setEmployee(employeeRepository.findById(request.getEmployeeId()).get());
        order.setUpdatedAt(LocalDateTime.now().withNano(0));
        Order created = repository.save(order);
        return mapper.toOrderResponse(created);
    }

    public List<OrderResponse> getAll() {
        return mapper.toListOrders(repository.findAllWithPaymentDetails());
    }

//    public OrderResponse updateStatus(Integer id, int newStatus) {
//        Order order = repository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
//        order.setStatus(newStatus);
//        Order updatedOrder = repository.save(order);
//        return mapper.toOrderResponse(updatedOrder);
//    }
@Transactional
public OrderResponse updateStatus(Integer id, int newStatus) {
    Order order = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

    // Nếu trạng thái mới là "Đã xác nhận" (2) và trạng thái hiện tại nhỏ hơn 2
    if (newStatus == 2 && order.getStatus() < 2) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);
        for (OrderDetail detail : orderDetails) {
            ProductDetail productDetail = productDetailRepository.findById(detail.getProductDetail().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductDetail not found"));
            int newQuantity = productDetail.getQuantity() - detail.getQuantity();
            if (newQuantity < 0) {
                throw new IllegalStateException("Số lượng tồn kho không đủ cho sản phẩm: "
                        + productDetail.getProduct().getProductName());
            }
            productDetail.setQuantity(newQuantity);
            productDetailRepository.save(productDetail);
        }
    }

    order.setStatus(newStatus);
    order.setUpdatedAt(LocalDateTime.now().withNano(0));
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
            order.setStatus(5);
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
        // 1. Validate và lấy thông tin giỏ hàng
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng với ID: " + cartId));

        // 2. Kiểm tra giỏ hàng có sản phẩm không
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Không thể tạo đơn hàng từ giỏ hàng trống");
        }

        // 3. Lấy thông tin khách hàng từ giỏ hàng
        Customer customer = cart.getCustomer();
        if (customer == null) {
            throw new IllegalArgumentException("Giỏ hàng không có thông tin khách hàng liên kết");
        }

        // 4. Tạo mã đơn hàng
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmss");
        String orderCode = "HD" + sdf.format(new Date());

        // 5. Tạo đơn hàng mới
        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomer(customer);

        // 6. Thiết lập thông tin khách hàng
        order.setCustomerName(orderRequest.getCustomerName() != null ?
                orderRequest.getCustomerName() : customer.getFullName());
        order.setPhone(orderRequest.getPhone() != null ?
                orderRequest.getPhone() : customer.getPhone());
        order.setAddress(orderRequest.getAddress());
        order.setNote(orderRequest.getNote());

        // 7. Thiết lập thông tin thanh toán và vận chuyển
        order.setShippingFee(orderRequest.getShippingFee() != null ?
                orderRequest.getShippingFee() : 0.0);
        order.setDiscountValue(orderRequest.getDiscountValue() != null ?
                orderRequest.getDiscountValue() : 0.0);

        // 8. Tính toán tổng giá
        double totalPrice = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        order.setTotalPrice(totalPrice);
        order.setTotalPayment(totalPrice + order.getShippingFee() - order.getDiscountValue());

        // 9. Thiết lập phương thức thanh toán
        if (orderRequest.getPaymentTypeId() != null) {
            PaymentType paymentType = paymentTypeRepository.findById(orderRequest.getPaymentTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại thanh toán"));
            order.setPaymentType(paymentType);
        }

        if (orderRequest.getPaymentMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(orderRequest.getPaymentMethodId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phương thức thanh toán"));
            order.setPaymentMethod(paymentMethod);
        }

        // 10. Thiết lập trạng thái và thời gian
        order.setOrderType(orderRequest.getOrderType() != null ? orderRequest.getOrderType() : 1);
        order.setStatus(1); // 1 = Chờ tiếp nhận
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // 11. Lưu đơn hàng
        order = repository.save(order);

        // 12. Chuyển sản phẩm từ giỏ hàng sang đơn hàng
        for (CartDetails cartDetail : cart.getItems()) {
            // 12a. Tạo chi tiết đơn hàng
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProductDetail(cartDetail.getProductDetail());
            orderDetail.setQuantity(cartDetail.getQuantity());
            orderDetail.setPrice(cartDetail.getPrice());
            orderDetail.setTotalPrice(cartDetail.getTotal_price());
            orderDetail.setStatus(1); // 1 = Hoạt động

            // 12b. Lưu chi tiết đơn hàng
            orderDetailRepository.save(orderDetail);
            // Xóa 12c: Không cập nhật số lượng tồn kho ở đây
        }

        // 13. Cập nhật trạng thái giỏ hàng (đã chuyển thành đơn hàng)
        cart.setStatus(2); // 2 = Đã chuyển thành đơn hàng
        cart.setCreated_at(LocalDateTime.now());
        cartRepository.save(cart);

        // 14. Trả về thông tin đơn hàng đã tạo
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
            ProductDetail productDetail=productDetailRepository.findById(item.getProductDetailId()).orElseThrow(
                    () -> new ResourceNotFoundException("getProductDetailId not found")
            );

            OrderDetailRequest orderDetailRequest = new OrderDetailRequest(
                    order.getId(),
                    item.getProductDetailId(),
                    productDetail.getProduct().getProductName()+" - "+productDetail.getColor()+" - "+productDetail.getSize(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getTotal_price(),
                    1,
                    1
            );
            orderDetailService.create(orderDetailRequest); // Tạo chi tiết đơn hàng

        }
        return mapper.toOrderResponse(order);
    }

    public Object[] getOrderSellCounts() {
        return repository.getOrderSellCounts();
    }

    public Object[] getOrderCounts() {
        return repository.getOrderCounts();

    }

    public List<Object[]> getOrdersByMonthIn( Integer year) {
        return repository.findOrdersByMonthInNative(year);
    }

    public List<Object[]> getOrdersByDayInJanuary(Integer month,Integer year) {
        return repository.findOrdersByDayInJanuaryNative(month,year);
    }

    public List<Object[]> findRevenueByMonthIn2025(Integer year) {
        return repository.findRevenueByMonthIn2025(year);
    }
    public List<Object[]> findRevenueByDayInMarch(Integer month,Integer year) {
        return repository.findRevenueByDayInMarch(month,year);
    }
    public Object[] getRevenueByYear(Integer year) {
         return repository.findRevenueByYear(year);

    }
    public Object[] getRevenueByMonth(Integer year, Integer month) {
         return repository.findRevenueByMonth(year, month);

    }
    public  Object[] getRevenueBetweenDates(String startDate, String endDate) {
        return repository.findRevenueBetweenDates(startDate, endDate);

    }

    public  Object[] getRevenueTotal() {
        return repository.findRevenueTotal();


    public OrderResponse getOrderByCode(String orderCode) {
        Order order = repository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + orderCode));
        return mapper.toOrderResponse(order);

    }
}