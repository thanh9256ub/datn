package com.example.datn.service;

import com.example.datn.controller.WebSocketController;
import com.example.datn.dto.request.PriceCheckRequest;
import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.PriceDiscrepancyResponse;
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
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
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

    public List<ProductDetailResponse> getBin(Integer productId) {
        return mapper.toListProductDetail(repository.findByProductIdAndStatus(productId,2));
    }

    public List<ProductDetailResponse> getProductDetailsByProductId(Integer productId) {

        productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: "));

        List<ProductDetail> productDetails = repository.findByProductIdAndStatusNot(productId, 2);

        return mapper.toListProductDetail(productDetails);
    }

    public List<ProductDetailResponse> createProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: "));

        List<ProductDetail> productDetailList = requests.stream().map(request -> {

            Color color = colorRepository.findById(request.getColorId()).orElseThrow(
                    () -> new ResourceNotFoundException("Color not found with ID: "));

            Size size = sizeRepository.findById(request.getSizeId()).orElseThrow(
                    () -> new ResourceNotFoundException("Size not found wicccth ID: "));

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


    public List<ProductDetailResponse> getProductDetailsByIds(List<Integer> productDetailIds) {
        // Truy vấn danh sách ProductDetail theo danh sách ID
        List<ProductDetail> productDetails = repository.findByIdIn(productDetailIds);

        // Chuyển đổi danh sách ProductDetail thành ProductDetailResponse
        return productDetails.stream()
                .map(this::mapToProductDetailResponse)
                .collect(Collectors.toList());
    }

    // Phương thức hỗ trợ chuyển đổi ProductDetail sang ProductDetailResponse
    private ProductDetailResponse mapToProductDetailResponse(ProductDetail productDetail) {
        ProductDetailResponse response = new ProductDetailResponse();
        response.setId(productDetail.getId());
        response.setPrice(productDetail.getPrice());
        response.setQuantity(productDetail.getQuantity());
        response.setStatus(productDetail.getStatus());
        response.setQr(productDetail.getQr()); // Ánh xạ qrCode sang qr
        response.setCreatedAt(productDetail.getCreatedAt());
        response.setUpdatedAt(productDetail.getUpdatedAt());

        // Gán trực tiếp các thực thể
        response.setProduct(productDetail.getProduct());
        response.setColor(productDetail.getColor());
        response.setSize(productDetail.getSize());

        return response;
    }

    @Transactional
    public ProductDetailResponse restoreProductQuantity(Integer productDetailId, Integer quantity) {
        ProductDetail productDetail = repository.findById(productDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + productDetailId));

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Số lượng khôi phục phải lớn hơn 0");
        }

        if (productDetail.getStatus() == 2) {
            throw new IllegalArgumentException("Không thể khôi phục số lượng cho ProductDetail đã bị xóa");
        }

        Integer currentQuantity = productDetail.getQuantity();
        productDetail.setQuantity(currentQuantity + quantity);
        productDetail.setStatus(productDetail.getQuantity() > 0 ? 1 : 0);

        ProductDetail savedProductDetail = repository.save(productDetail);

        updateTotalQuantity(productDetail.getProduct().getId());

        log.info("✅ Đã khôi phục số lượng cho ProductDetail {}: {} -> {}",
                productDetailId, currentQuantity, productDetail.getQuantity());

        return mapper.toProductDetailResponse(savedProductDetail);
    }

    public ProductDetailResponse updateQR(Integer pdId) {
        ProductDetail productDetail = repository.findById(pdId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Detail not found with ID: " + pdId));

        // Chỉ lưu ID vào cột qr thay vì Base64
        productDetail.setQr(String.valueOf(pdId));

        repository.save(productDetail);
        return mapper.toProductDetailResponse(productDetail);
    }

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

        Double oldPrice = productDetail.getPrice();

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
        if (request.getPrice() != null && !request.getPrice().equals(oldPrice)) {
            webSocketController.sendProductPriceUpdate(
                    productDetail.getProduct().getId(),
                    productDetail.getProduct().getProductCode(),
                    productDetail.getColor().getId(),
                    productDetail.getSize().getId(),
                    productDetail.getPrice(),
                    productDetail.getId() // Thêm productDetailId
            );
        }
        updateTotalQuantity(productDetail.getProduct().getId());

        return mapper.toProductDetailResponse(productDetail);
    }

    public List<ProductDetailResponse> updateProductDetails(Integer productId, List<ProductDetailRequest> requests) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + productId));

        List<ProductDetail> updatedDetails = requests.stream().map(request -> {
            ProductDetail productDetail = repository.findById(request.getId()).orElseThrow(
                    () -> new ResourceNotFoundException("Product Detail not found with ID: " + request.getId()));
            Double oldPrice = productDetail.getPrice();
            productDetail.setQuantity(request.getQuantity());
            productDetail.setPrice(request.getPrice());
            productDetail.setStatus(request.getStatus());
            if (request.getPrice() != null && !request.getPrice().equals(oldPrice)) {
                webSocketController.sendProductPriceUpdate(
                        product.getId(),
                        product.getProductCode(),
                        productDetail.getColor().getId(),
                        productDetail.getSize().getId(),
                        request.getPrice(),
                        productDetail.getId() // Thêm productDetailId
                );
            }
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
        List<ProductDetail> productDetails = repository.findByProductIdAndColorIdAndStatusNot(productId, colorId, 2);

        // Lấy danh sách các size của productDetail
        List<Size> sizes = productDetails.stream()
                .map(ProductDetail::getSize)
                .distinct()  // Đảm bảo chỉ lấy các size duy nhất
                .collect(Collectors.toList());

        return sizes;
    }

    public ProductDetailResponse getDetailByAttributes(Integer productId, Integer colorId, Integer sizeId) {
        ProductDetail productDetail = repository.findByProduct_IdAndColor_IdAndSize_IdAndStatusNot(productId, colorId, sizeId, 2)
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

    public List<ProductDetailResponse> deleteAndRestoreProductDetails(List<Integer> pdIds) {
        // Lấy tất cả product details từ database
        List<ProductDetail> productDetails = repository.findAllById(pdIds);

        // Kiểm tra nếu có ID không tồn tại
        if (productDetails.size() != pdIds.size()) {
            List<Integer> foundIds = productDetails.stream()
                    .map(ProductDetail::getId)
                    .collect(Collectors.toList());

            List<Integer> missingIds = pdIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toList());

            throw new ResourceNotFoundException("Product Details not found with IDs: " + missingIds);
        }

        // Cập nhật trạng thái cho từng product detail
        for (ProductDetail productDetail : productDetails) {
            if (productDetail.getStatus() != 2) {
                productDetail.setStatus(2); // Đánh dấu là đã xóa
            } else {
                productDetail.setStatus(productDetail.getQuantity() > 0 ? 1 : 0); // Khôi phục
            }
        }

        // Lưu tất cả thay đổi
        List<ProductDetail> savedDetails = repository.saveAll(productDetails);

        Integer productId = productDetails.get(0).getProduct().getId();

        updateTotalQuantity(productId);

        // Chuyển đổi sang response
        return savedDetails.stream()
                .map(mapper::toProductDetailResponse)
                .collect(Collectors.toList());
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

    public List<ProductDetailResponse> searchProducts(
            String query,
            String brand,
            String color,
            String size,
            Double minPrice,
            Double maxPrice,
            String category,
            String material
    ) {
        Specification<ProductDetail> spec = ProductSpecification.searchProducts(
                query, brand, color, size, minPrice, maxPrice, category, material
        );

        return mapper.toListProductDetail(repository.findAll(spec));
    }

    public Map<Integer, Double> checkCurrentPrices(List<Integer> productDetailIds) {
        // Lấy danh sách product details từ database
        List<ProductDetail> productDetails = repository.findByIdIn(productDetailIds);

        // Tạo map chứa giá hiện tại
        return productDetails.stream()
                .collect(Collectors.toMap(
                        ProductDetail::getId,
                        ProductDetail::getPrice,
                        (existing, replacement) -> existing
                ));
    }

    public Map<Integer, ProductDetail> getProductDetailsMap(List<Integer> productDetailIds) {
        List<ProductDetail> details = repository.findByIdIn(productDetailIds);
        return details.stream()
                .collect(Collectors.toMap(
                        ProductDetail::getId,
                        Function.identity()
                ));
    }

    public List<PriceDiscrepancyResponse> checkPriceDiscrepancies(List<PriceCheckRequest> requests) {
        List<Integer> productDetailIds = requests.stream()
                .map(PriceCheckRequest::getProductDetailId)
                .collect(Collectors.toList());
        Map<Integer, ProductDetail> productDetailsMap = getProductDetailsMap(productDetailIds);
        return requests.stream()
                .map(request -> {
                    ProductDetail productDetail = productDetailsMap.get(request.getProductDetailId());
                    Double currentPrice = request.getCurrentPrice() != null ? request.getCurrentPrice() : 0.0;
                    Double newPrice = productDetail != null ? productDetail.getPrice() : 0.0;
                    // Sử dụng dung sai để so sánh giá
                    boolean hasDiscrepancy = productDetail != null &&
                            Math.abs(newPrice - currentPrice) > 0.01;
                    String productName = productDetail != null && productDetail.getProduct() != null
                            ? productDetail.getProduct().getProductName()
                            : "Unknown Product";
                    String colorName = productDetail != null && productDetail.getColor() != null
                            ? productDetail.getColor().getColorName()
                            : "Unknown Color";
                    String sizeName = productDetail != null && productDetail.getSize() != null
                            ? productDetail.getSize().getSizeName()
                            : "Unknown Size";
                    log.info("Checking price for productDetailId: {}, productName: {}, color: {}, size: {}, currentPrice: {}, newPrice: {}, hasDiscrepancy: {}",
                            request.getProductDetailId(), productName, colorName, sizeName, currentPrice, newPrice, hasDiscrepancy);
                    return new PriceDiscrepancyResponse(
                            request.getProductDetailId(),
                            hasDiscrepancy,
                            currentPrice,
                            newPrice,
                            productName,
                            colorName,
                            sizeName
                    );
                })
                .filter(response -> response.isHasDiscrepancy())
                .collect(Collectors.toList());
    }
}