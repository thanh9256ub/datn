package com.example.datn.controller;

import com.example.datn.dto.request.*;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.OrderResponse;
import com.example.datn.dto.response.PaymentMethodResponse;
import com.example.datn.entity.Order;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.service.DonHangService;
import com.example.datn.service.OrderService;
import com.example.datn.service.PaymentMethodService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("order")

public class OrderController {
    @Autowired
    OrderService service;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<OrderResponse>> add(
            @RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = service.create(orderRequest);
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(), "Create successfully", orderResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAll(){
        List<OrderResponse>list=service.getAll();
        ApiResponse<List<OrderResponse>> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod retrieved successfully",list);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOne(@PathVariable("id") Integer id){
        OrderResponse orderResponse=service.getById(id);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> update(
            @PathVariable("id") Integer id,@RequestBody OrderRequest orderRequest){
        OrderResponse orderResponse=service.update(id,orderRequest);
        ApiResponse<OrderResponse>apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod updated successfully",orderResponse);
        return  ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{orderId}/update-total-price")
    public ResponseEntity<ApiResponse<Order>> updateTotalPrice(
            @PathVariable Integer orderId,
            @RequestBody Double additionalPayment) {
        Order updatedOrder = service.updateOrderTotalPrice(orderId, additionalPayment);
        ApiResponse<Order> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Order total price updated successfully",
                updatedOrder
        );
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> delete(@PathVariable("id") Integer id){
        service.detele(id);
        ApiResponse<OrderResponse> apiResponse=new ApiResponse<>(
                HttpStatus.OK.value(), "PaymentMethod deleted successfully",null);
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{orderId}/customer-info")
    public ResponseEntity<ApiResponse<OrderResponse>> updateCustomerInfo(
            @PathVariable Integer orderId,
            @RequestBody @Valid CustomerInfoRequest request) {

        OrderResponse updatedOrder = service.updateCustomerInfo(orderId, request);

        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Cập nhật thành công",
                updatedOrder
        ));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable("id") Integer id,
            @RequestParam int newStatus,
            HttpServletResponse response) {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        OrderResponse orderResponse = service.updateStatus(id, newStatus);

        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(), "Order status updated successfully", orderResponse);

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/filter")
    public List<OrderResponse> filterOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) Integer status) {
        return service.filterOrders(search, minPrice, maxPrice, startDate, endDate, status);
    }


    @GetMapping("/order-sell-counts")
    public Object[] getOrderSellCounts() {
        return service.getOrderSellCounts();
        //ti le chon mua hang
    }

    @GetMapping("/order-counts")
    public Object[] getOrderCounts() {
        return service.getOrderCounts();
        //ti le thanh tong
    }

    @GetMapping("/orders-by-month/{year}")
    public List<Object[]> getOrdersByMonthIn(@PathVariable Integer year) {
        return service.getOrdersByMonthIn(year);
        //dh theo nam
    }

    @GetMapping("/orders-by-day-january")
    public List<Object[]> getOrdersByDayInJanuary(@RequestParam Integer month,@RequestParam Integer year) {
        return service.getOrdersByDayInJanuary(month,year);
        //hd theo thang
    }


    @GetMapping("/orders-revenue-year/{year}")
    public List<Object[]> findRevenueByMonthIn2025(@PathVariable Integer year) {
        return service.findRevenueByMonthIn2025(year);
        //dt  theo nam
    }

    @GetMapping("/orders-revenue-month")
    public List<Object[]> findRevenueByDayInMarch(@RequestParam Integer month,@RequestParam Integer year ) {
        return service.findRevenueByDayInMarch(month,year );
        //dt  theo thang
    }

    @GetMapping("/revenue-year")
    public Object[] getRevenueByYear(@RequestParam Integer year ) {
        return service.getRevenueByYear(year);
        //nam
    }

    @GetMapping("/revenue-month")
    public Object[] getRevenueByMonth(@RequestParam Integer year, @RequestParam Integer month ) {
        return service.getRevenueByMonth(year,month  );
        //thang
    }

    @GetMapping("/revenue-year-month")
    public Object[] getRevenueBetweenDates(@RequestParam String startDate,@RequestParam String endDate ) {
        return service.getRevenueBetweenDates(startDate, endDate  );
        //ngay
    }

    @GetMapping("/revenue-total")
    public Object[] getRevenueTotal() {
        return service.getRevenueTotal();
        //tong
    }

    @GetMapping("/dashboard-status5")
    public int countOrdersWithStatus5Today() {
        return service.countOrdersWithStatus5Today();
    }

    @GetMapping("/dashboard-status2")
    public int countOrdersWithStatus2Today() {
        return service.countOrdersWithStatus2Today();
    }

    @GetMapping("/dashboard-product")
    public Integer getTotalQuantityOfTodayOrdersWithStatus5() {
        return service.getTotalQuantityOfTodayOrdersWithStatus5();
    }

    @GetMapping("/dashboard-revenue")
    public BigDecimal getTotalNetPriceOfTodayOrdersWithStatus5() {
        return service.getTotalNetPriceOfTodayOrdersWithStatus5();
    }

    @PostMapping("/checkout/{cartId}")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @PathVariable("cartId") Integer cartId,
            @Valid @RequestBody OrderRequest orderRequest) {
        try {
            OrderResponse orderResponse = service.createOrderFromCart(cartId, orderRequest);
            ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                    HttpStatus.CREATED.value(),
                    "Order created successfully from cart",
                    orderResponse
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Error creating order: " + e.getMessage(), null));
        }
    }

    @PostMapping("/checkout/guest")
    public ResponseEntity<ApiResponse<OrderResponse>> checkoutGuest(
            @Valid @RequestBody GuestOrderRequest guestOrderRequest) {
        try {
            OrderResponse orderResponse = service.createOrderForGuest(guestOrderRequest);
            ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                    HttpStatus.CREATED.value(),
                    "Order created successfully for guest",
                    orderResponse
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "An unexpected error occurred: " + e.getMessage(), null));
        }

    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByCode(
            @PathVariable String orderCode) {

        try {
            OrderResponse order = service.getOrderByCode(orderCode);
            return ResponseEntity.ok(new ApiResponse<>(200, "Order found", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Order not found", null));
        }
    }

    @PutMapping("/{id}/note")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderNote(
            @PathVariable Integer id,
            @RequestBody @Valid UpdateOrderNoteRequest request) {
        try {
            System.out.println("Received update note request for order id: " + id + ", note: " + request.getNote()); // Debug
            OrderResponse response = service.updateNote(id, request);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Cập nhật ghi chú đơn hàng thành công", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Có lỗi xảy ra khi cập nhật ghi chú: " + e.getMessage(), null));
        }
    }
    @PutMapping("/{orderId}/update-shipping-and-total")
    public ResponseEntity<ApiResponse<OrderResponse>> updateShippingAndTotal(
            @PathVariable Integer orderId,
            @RequestBody @Valid UpdateShippingAndTotalRequest request) {
        try {
            OrderResponse updatedOrder = service.updateShippingAndTotal(orderId, request);
            ApiResponse<OrderResponse> apiResponse = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Order shipping fee and total price updated successfully",
                    updatedOrder
            );
            return ResponseEntity.ok(apiResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating order: " + e.getMessage(), null));
        }
    }
}
