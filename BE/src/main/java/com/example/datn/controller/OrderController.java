package com.example.datn.controller;

import com.example.datn.dto.request.CustomerInfoRequest;
import com.example.datn.dto.request.GuestOrderRequest;
import com.example.datn.dto.request.OrderRequest;
import com.example.datn.dto.request.PaymentMethodRequest;
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
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) Integer status) { // Thêm status
        return service.filterOrders(orderCode, minPrice, maxPrice, startDate, endDate, status);
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
}
