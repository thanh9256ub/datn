package com.example.datn.service;

import com.example.datn.dto.request.AddToCartRequest;
import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.CartItemResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Cart;
import com.example.datn.entity.Customer;
import com.example.datn.entity.ProductDetail;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CartMapper;
import com.example.datn.repository.CartDetailsRepository;
import com.example.datn.repository.CartRepository;
import com.example.datn.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    CartRepository repository;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    CartMapper mapper;
    @Autowired
    CartDetailsRepository cartDetailsRepo;
    public List<CartResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public CartResponse createCart(CartRequest request){
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Cart cart = mapper.toCart(request);
        cart.setCustomer(customer);
        cart.setCreated_at(LocalDateTime.now());
        return mapper.toCartResponse(repository.save(cart));
    }

    public CartResponse getCartById(Integer id){

        Cart cart = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        return mapper.toCartResponse(cart);
    }

    public CartResponse updateCart(Integer id, CartRequest request){

        Cart cart = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        mapper.updateCart( cart, request);

        return mapper.toCartResponse(repository.save(cart));
    }

    public void deleteCart(Integer id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        repository.deleteById(id);
    }

    @Transactional
    public Cart getOrCreateCart(Integer customerId) {
        // 1. Kiểm tra customer tồn tại
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        // 2. Tìm giỏ hàng đang hoạt động (status = 1)
        Optional<Cart> existingCart = repository.findByCustomerId(customerId);

        // 3. Nếu đã có thì trả về
        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        // 4. Nếu chưa có thì tạo mới
        Cart newCart = new Cart();
        newCart.setCustomer(customer);
        newCart.setCreated_at(LocalDateTime.now());
        newCart.setTotal_price(0.0);

        // 5. Bắt exception khi save
        try {
            return repository.save(newCart);
        } catch (Exception e) {
            // Nếu lỗi thì thử lấy lại giỏ hàng (phòng trường hợp đã được tạo bởi request khác)
            return repository.findByCustomerId(customerId)
                    .orElseThrow(() -> new RuntimeException("Không thể tạo giỏ hàng"));
        }
    }
}
