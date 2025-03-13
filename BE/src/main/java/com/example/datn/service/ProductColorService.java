package com.example.datn.service;

import com.example.datn.dto.request.ImageRequest;
import com.example.datn.dto.request.ProductColorRequest;
import com.example.datn.dto.response.ImageResponse;
import com.example.datn.dto.response.ProductColorResponse;
import com.example.datn.entity.Color;
import com.example.datn.entity.Image;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductColor;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ProductColorMapper;
import com.example.datn.repository.ColorRepository;
import com.example.datn.repository.ImageRepository;
import com.example.datn.repository.ProductColorRepository;
import com.example.datn.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductColorService {

    @Autowired
    ProductColorRepository repository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ColorRepository colorRepository;

    @Autowired
    ProductColorMapper mapper;

    @Autowired
    ImageRepository imageRepository;

    public List<ProductColorResponse> createProductColor(ProductColorRequest request){

        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new ResourceNotFoundException("Product not exist"));

        List<Color> colors = colorRepository.findAllById(request.getColorIds());
        if (colors.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy màu sắc nào.");
        }

        List<ProductColor> productColors = colors.stream()
                .map(color -> {
                    ProductColor productColor = new ProductColor();
                    productColor.setProduct(product);
                    productColor.setColor(color);
                    productColor.setDescription(request.getDescription() != null ? request.getDescription() : "");
                    return productColor;
                })
                .collect(Collectors.toList());

        repository.saveAll(productColors);

        return mapper.toListResponse(productColors);
    }

    public List<ProductColorResponse> getAll(){
        return mapper.toListResponse(repository.findAll());
    }

    public List<ImageResponse> addImagesToProductColor(Integer productColorId, List<ImageRequest> imageRequests) {
        ProductColor productColor = repository.findById(productColorId).orElseThrow(
                () -> new ResourceNotFoundException("ProductColor not exist"));

        List<Image> images = imageRequests.stream()
                .map(request -> {
                    Image image = new Image();
                    image.setProductColor(productColor);
                    image.setImage(request.getImage());
                    return image;
                })
                .collect(Collectors.toList());

        imageRepository.saveAll(images);

        return mapper.toListImageResponse(images);
    }

    public List<ImageResponse> getImages(){
        return mapper.toListImageResponse(imageRepository.findAll());
    }
}
