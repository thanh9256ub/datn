package com.example.datn.service;

import com.example.datn.dto.request.AddToCartRequest;
import com.example.datn.dto.request.CartDetailsRequest;
import com.example.datn.dto.request.CartRequest;
import com.example.datn.dto.response.CartDetailsResponse;
import com.example.datn.dto.response.CartResponse;
import com.example.datn.entity.Cart;
import com.example.datn.entity.CartDetails;
import com.example.datn.entity.Customer;
import com.example.datn.entity.ProductDetail;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.CartDetailsMapper;
import com.example.datn.mapper.CartMapper;
import com.example.datn.repository.CartDetailsRepository;
import com.example.datn.repository.CartRepository;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.ProductDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartDetailsService {
    @Autowired
    CartDetailsRepository repository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    ProductDetailRepository productDetailRepository;
    @Autowired
    CartDetailsMapper mapper;
@Autowired
    CartService cartService;
    public List<CartDetailsResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public CartDetailsResponse createCart(CartDetailsRequest request){
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        CartDetails cartDetails = mapper.toCartDetails(request);
        cartDetails.setCart(cart);
        cartDetails.setProductDetail(productDetail);
        cartDetails.setCreated_at(LocalDateTime.now());
        return mapper.toCartDetailsResponse(repository.save(cartDetails));
    }

    public CartDetailsResponse getCartById(Long id){

        CartDetails cartDetails = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        return mapper.toCartDetailsResponse(cartDetails);
    }

    public CartDetailsResponse updateCart(Long id, CartDetailsRequest request){

        CartDetails cartDetails = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        mapper.updateCartDetails( cartDetails, request);

        return mapper.toCartDetailsResponse(repository.save(cartDetails));
    }

    public void deleteCart(Long id){

        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Brand id is not exists with given id: " + id));

        repository.deleteById(id);
    }

    public List<CartDetailsResponse> getCartDetailsByCartId(Integer cartId) {
        List<CartDetails> cartDetails = repository.findByCartId(cartId);
        return mapper.toListResponse(cartDetails);
    }
    @Transactional
    public CartDetailsResponse addProductToCart(AddToCartRequest request) {
        // 1. Validate request
        if (request.getCustomerId() == null || request.getProductDetailId() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("CustomerId, ProductDetailId, and valid Quantity are required");
        }

        // 2. Lấy hoặc tạo giỏ hàng
        Cart cart = cartService.getOrCreateCart(request.getCustomerId());
        if (cart.getId() == null) {
            throw new IllegalStateException("Cart ID is null after creation");
        }
        System.out.println("Using cart ID: " + cart.getId());

        // 3. Kiểm tra product detail
        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product detail not found with id: " + request.getProductDetailId()));

        // 4. Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        Optional<CartDetails> existingItem = repository.findByCartIdAndProductDetailId(
                cart.getId(), productDetail.getId());

        CartDetails cartDetails;
        if (existingItem.isPresent()) {
            cartDetails = existingItem.get();
            cartDetails.setQuantity(cartDetails.getQuantity() + request.getQuantity());
        } else {
            cartDetails = new CartDetails();
            cartDetails.setCart(cart);
            cartDetails.setProductDetail(productDetail);
            cartDetails.setQuantity(request.getQuantity());
            cartDetails.setCreated_at(LocalDateTime.now());
        }

        // 5. Cập nhật giá
        cartDetails.setPrice(productDetail.getPrice());
        cartDetails.setTotal_price(productDetail.getPrice() * cartDetails.getQuantity());

        // 6. Lưu vào database
        CartDetails savedCartDetails = repository.save(cartDetails);
        System.out.println("Saved cart detail with ID: " + savedCartDetails.getId());
        return mapper.toCartDetailsResponse(savedCartDetails);
    }


}
