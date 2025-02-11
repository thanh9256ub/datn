package com.example.datn.service;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import com.example.datn.entity.Size;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ProductDetailMapper;
import com.example.datn.repository.ColorRepository;
import com.example.datn.repository.ProductDetailRepository;
import com.example.datn.repository.ProductRepository;
import com.example.datn.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductDetailService {

    @Autowired
    ProductDetailRepository repository;

    @Autowired
    ProductDetailMapper mapper;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ColorRepository colorRepository;

    @Autowired
    SizeRepository sizeRepository;

    public ProductDetailResponse createProductDetail(ProductDetailRequest request){

        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: ")
        );

        Color color = colorRepository.findById(request.getColorId()).orElseThrow(
                () -> new ResourceNotFoundException("Color not found with ID: ")
        );

        Size size = sizeRepository.findById(request.getSizeId()).orElseThrow(
                () -> new ResourceNotFoundException("Size not found with ID: ")
        );

        ProductDetail productDetail = mapper.toProductDetail(request);

        productDetail.setProduct(product);
        productDetail.setColor(color);
        productDetail.setSize(size);
        productDetail.setStatus(request.getQuantity() == 0 ? 0 : 1);

        return mapper.toProductDetailResponse(repository.save(productDetail));
    }
}
