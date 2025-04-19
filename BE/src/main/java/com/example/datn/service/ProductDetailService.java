package com.example.datn.service;

import com.example.datn.controller.WebSocketController;
import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.dto.response.ProductResponse;
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
import com.example.datn.specification.ProductSpecification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
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

    @Autowired
    WebSocketController webSocketController;

    public List<ProductDetailResponse> getAll() {
        return mapper.toListProductDetail(repository.findByStatusNot(2));
    }

    public List<ProductDetailResponse> getBin() {
        return mapper.toListProductDetail(repository.findByStatus(2));
    }

    public List<ProductDetailResponse> getProductDetailsByProductId(Integer productId) {

        productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: "));

        List<ProductDetail> productDetails = repository.findByProductId(productId);

        return mapper.toListProductDetail(productDetails);
    }

    public List<ProductDetailResponse> createProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: "));

        List<ProductDetail> productDetailList = requests.stream().map(request -> {

            Color color = colorRepository.findById(request.getColorId()).orElseThrow(
                    () -> new ResourceNotFoundException("Color not found with ID: "));

            Size size = sizeRepository.findById(request.getSizeId()).orElseThrow(
                    () -> new ResourceNotFoundException("Size not found with ID: "));

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

    public Map<Integer, Integer> checkStockAvailability(List<Map<String, Integer>> checkStockRequests) {
        List<Integer> productDetailIds = checkStockRequests.stream()
                .map(request -> request.get("productDetailId"))
                .collect(Collectors.toList());

        // Thêm điều kiện kiểm tra status = 1 (còn hàng)
        List<ProductDetail> productDetails = repository.findByIdInAndStatus(productDetailIds, 1);

        return productDetails.stream()
                .collect(Collectors.toMap(
                        ProductDetail::getId,
                        ProductDetail::getQuantity,
                        (existing, replacement) -> existing
                ));
    }

    public ProductDetailResponse updateQR(Integer pdId) {
        ProductDetail productDetail = repository.findById(pdId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + pdId));

        // Chỉ lưu ID vào cột qr thay vì Base64
        productDetail.setQr(String.valueOf(pdId));

        repository.save(productDetail);
        return mapper.toProductDetailResponse(productDetail);
    }

    //    public void updateTotalQuantity(Integer productId) {
//
//        Integer updatedTotalQuantity = repository.sumQuantityByProductId(productId);
//
//        Product product = productRepository.findById(productId).orElseThrow(
//                () -> new ResourceNotFoundException("Product not found with ID: " + productId));
//
//        product.setTotalQuantity(updatedTotalQuantity);
//        product.setStatus(updatedTotalQuantity > 0 ? 1 : 0);
//        Product savedProduct = productRepository.save(product);
//
//        // Gửi thông báo realtime sau khi cập nhật thành công
//        webSocketController.sendProductUpdate(
//                savedProduct.getProductCode(),
//                savedProduct.getTotalQuantity()
//        );
//
//    }
    public void updateTotalQuantity(Integer productId) {
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId));

        Integer oldQuantity = product.getTotalQuantity();

        Integer updatedTotalQuantity = repository.sumQuantityByProductId(productId);

        if (!updatedTotalQuantity.equals(oldQuantity)) {
            product.setTotalQuantity(updatedTotalQuantity);
            product.setStatus(updatedTotalQuantity > 0 ? 1 : 0);
            Product savedProduct = productRepository.save(product);

            // CHỈ gửi thông báo nếu số lượng thay đổi
            webSocketController.sendProductUpdate(
                    savedProduct.getProductCode(),
                    savedProduct.getTotalQuantity()
            );

            log.info("✅ Đã cập nhật số lượng sản phẩm {} từ {} -> {}",
                    productId, oldQuantity, updatedTotalQuantity);
        }
    }

    public ProductDetailResponse updateProductDetail(Integer pdId, ProductDetailRequest request) {
        ProductDetail productDetail = repository.findById(pdId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + pdId));

        if (request.getQuantity() != null && request.getQuantity() >= 0) {
            productDetail.setQuantity(request.getQuantity());
        }

        if (request.getPrice() != null && request.getPrice() >= 0) {
            productDetail.setPrice(request.getPrice());
        }

        if (request.getStatus() != null) {
            productDetail.setStatus(request.getStatus());
        }

        if (request.getColorId() != null) {
            Color color = colorRepository.findById(request.getColorId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Color not found with ID: " + request.getColorId()));
            productDetail.setColor(color);
        }

        if (request.getSizeId() != null) {
            Size size = sizeRepository.findById(request.getSizeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Size not found with ID: " + request.getSizeId()));
            productDetail.setSize(size);
        }

        repository.save(productDetail);

        updateTotalQuantity(productDetail.getProduct().getId());

        return mapper.toProductDetailResponse(productDetail);
    }

    public List<ProductDetailResponse> updateProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId));

        List<ProductDetail> updatedDetails = requests.stream().map(request -> {
            ProductDetail productDetail = repository.findById(request.getId()).orElseThrow(
                    () -> new ResourceNotFoundException("Product Detail not found with ID: " + request.getId()));

            productDetail.setQuantity(request.getQuantity());
            productDetail.setStatus(request.getStatus());

            return productDetail;
        }).toList();

        repository.saveAll(updatedDetails);

        updateTotalQuantity(productId);

        return mapper.toListProductDetail(updatedDetails);
    }

    public List<Size> getSizesByProductIdAndColor(Integer productId, Integer colorId) {

        // Kiểm tra sự tồn tại của sản phẩm
        productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId)
        );

        // Kiểm tra sự tồn tại của màu sắc
        Color color = colorRepository.findById(colorId).orElseThrow(
                () -> new ResourceNotFoundException("Color not found with ID: " + colorId)
        );

        // Lấy tất cả các productDetail theo productId và colorId
        List<ProductDetail> productDetails = repository.findByProductIdAndColorId(productId, colorId);

        // Lấy danh sách các size của productDetail
        List<Size> sizes = productDetails.stream()
                .map(ProductDetail::getSize)
                .distinct()  // Đảm bảo chỉ lấy các size duy nhất
                .collect(Collectors.toList());

        return sizes;
    }

    public ProductDetailResponse getDetailByAttributes(Integer productId, Integer colorId, Integer sizeId) {
        ProductDetail productDetail = repository.findByProduct_IdAndColor_IdAndSize_Id(productId, colorId, sizeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Product detail not found with productId: %d, colorId: %d, sizeId: %d",
                                productId, colorId, sizeId)
                ));

        return mapper.toProductDetailResponse(productDetail);
    }

    public ProductDetailResponse deleteAndRestoreProductDetail(Integer pdId) {
        ProductDetail productDetail = repository.findById(pdId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + pdId));

        if (productDetail.getStatus() != 2) {
            productDetail.setStatus(2);
        } else {
            productDetail.setStatus(productDetail.getQuantity() > 0 ? 1 : 0);
        }

        return mapper.toProductDetailResponse(repository.save(productDetail));
    }

    public List<ProductDetailResponse> getRelatedProducts(Integer pId) {
        return mapper.toListProductDetail(repository.findAllExceptId(pId));
    }

    public void updateProductDetaiStatus0() {
        for (ProductDetail productDetail : repository.findAll()) {
            if (productDetail.getStatus() == 1 && productDetail.getQuantity() == 0) {
                productDetail.setStatus(0);
                repository.save(productDetail);
            }
        }
        for (Product product : productRepository.findAll()) {
            if (product.getStatus() == 1 && product.getTotalQuantity() == 0) {
                product.setStatus(0);
                productRepository.save(product);
            }
        }
    }
    public List<ProductDetailResponse> searchProductDetailAI(String name) {
        Specification<ProductDetail> spec = Specification
                .where(ProductSpecification.hasColor(name))
                .or(ProductSpecification.hasPrice(name))
                .or(ProductSpecification.hasSize(name))
               .and(ProductSpecification.hasStatusPDTwo());
        return mapper.toListProductDetail(repository.findAll( spec));
    }
}