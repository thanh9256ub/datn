package com.example.datn.service;

import com.example.datn.dto.request.BrandRequest;
import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.BrandResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Brand;
import com.example.datn.entity.Cart;
import com.example.datn.entity.Customer;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.BrandMapper;
import com.example.datn.mapper.CartMapper;
import com.example.datn.repository.BrandRepository;
import com.example.datn.repository.CartRepository;
import com.example.datn.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class CartService {
    @Autowired
    CartRepository repository;
@Autowired
    CustomerRepository customerRepository;
    @Autowired
    CartMapper mapper;

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
}

