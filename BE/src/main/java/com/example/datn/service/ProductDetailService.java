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

import java.util.ArrayList;
import java.util.List;

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

    public List<ProductDetailResponse> getAll() {
        return mapper.toListProductDetail(repository.findAll());
    }

    public List<ProductDetailResponse> createProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: ")
        );

        List<ProductDetail> productDetailList = new ArrayList<>();

        for (ProductDetailRequest request : requests) {

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

            productDetailList.add(productDetail);
        }

        return mapper.toListProductDetail(repository.saveAll(productDetailList));
    }
}
