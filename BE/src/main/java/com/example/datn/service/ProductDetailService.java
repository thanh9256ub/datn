package com.example.datn.service;

import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.entity.Color;
import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import com.example.datn.entity.Size;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ProductDetailMapper;
import com.example.datn.repository.ProductRepository;
import com.example.datn.repository.ColorRepository;
import com.example.datn.repository.ProductDetailRepository;
import com.example.datn.repository.SizeRepository;
import com.example.datn.utils.QRCodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<ProductDetailResponse> getProductDetailsByProductId(Integer productId) {

        productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: ")
        );

        List<ProductDetail> productDetails = repository.findByProductId(productId);

        return mapper.toListProductDetail(productDetails);
    }

    public List<ProductDetailResponse> createProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: ")
        );

        List<ProductDetail> productDetailList = requests.stream().map(request -> {

            Color color = colorRepository.findById(request.getColorId()).orElseThrow(
                    () -> new ResourceNotFoundException("Color not found with ID: ")
            );

            Size size = sizeRepository.findById(request.getSizeId()).orElseThrow(
                    () -> new ResourceNotFoundException("Size not found with ID: ")
            );

            ProductDetail productDetail = mapper.toProductDetail(request);

            productDetail.setId(null);
            productDetail.setProduct(product);
            productDetail.setColor(color);
            productDetail.setSize(size);
            productDetail.setStatus(request.getQuantity() > 0 ? 1 : 0);
            productDetail.setQr("");

            return productDetail;

        }).toList();

        repository.saveAll(productDetailList);

        updateTotalQuantity(productId);

        return mapper.toListProductDetail(productDetailList);
    }

    public ProductDetailResponse updateQR(Integer pdId) {
        ProductDetail productDetail = repository.findById(pdId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + pdId));

        try {
            String qrCodeData = "" + pdId;
            String qrCodeBase64 = QRCodeUtil.generateQRCode(qrCodeData);
            productDetail.setQr(qrCodeBase64);
            repository.save(productDetail);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapper.toProductDetailResponse(productDetail);
    }

    private void updateTotalQuantity(Integer productId) {

        Integer updatedTotalQuantity = repository.sumQuantityByProductId(productId);

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId)
        );

        product.setTotalQuantity(updatedTotalQuantity);
        product.setStatus(updatedTotalQuantity > 0 ? 1 : 0);
        productRepository.save(product);
    }

    public ProductDetailResponse updateProductDetail(Integer pdId, Integer status, Integer quantity) {
        ProductDetail productDetail = repository.findById(pdId).orElseThrow(
                () -> new ResourceNotFoundException("Product Detail not found ID: " + pdId));

        Integer originalQuantity = productDetail.getQuantity();

        if (quantity != null && quantity >= 0) {
            productDetail.setQuantity(quantity);
        } else {
            productDetail.setQuantity(originalQuantity);
        }


        if (status != null) {
            productDetail.setStatus(status);
        }else{
            productDetail.setStatus(productDetail.getStatus());
        }

        repository.save(productDetail);

        updateTotalQuantity(productDetail.getProduct().getId());

        return mapper.toProductDetailResponse(productDetail);
    }

    public List<ProductDetailResponse> updateProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId)
        );

        List<ProductDetail> updatedDetails = requests.stream().map(request -> {
            ProductDetail productDetail = repository.findById(request.getId()).orElseThrow(
                    () -> new ResourceNotFoundException("Product Detail not found with ID: " + request.getId())
            );

            productDetail.setQuantity(request.getQuantity());
            productDetail.setStatus(request.getStatus());

            return productDetail;
        }).toList();

        repository.saveAll(updatedDetails);

        updateTotalQuantity(productId);

        return mapper.toListProductDetail(updatedDetails);
    }

}
