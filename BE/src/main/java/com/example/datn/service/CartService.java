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
import org.springframework.stereotype.Service;

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

    @Transactional // Đảm bảo giao dịch được thực thi đầy đủ
    public Cart getOrCreateCart(Integer customerId) {
        // Kiểm tra customer tồn tại
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        // Tìm giỏ hàng hiện tại
        Optional<Cart> existingCart = repository.findByCustomerId(customerId);

        if (existingCart.isPresent()) {
            System.out.println("Found existing cart with ID: " + existingCart.get().getId());
            return existingCart.get();
        } else {
            // Tạo giỏ hàng mới
            Cart newCart = new Cart();
            newCart.setCustomer(customer);
            newCart.setCreated_at(LocalDateTime.now());

            // Lưu giỏ hàng và đảm bảo có ID
            Cart savedCart = repository.save(newCart);
            System.out.println("Created new cart with ID: " + savedCart.getId());
            return savedCart;
        }
    }
}
