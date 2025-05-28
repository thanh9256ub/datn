package com.example.datn.controller;

import com.example.datn.dto.request.PriceCheckRequest;
import com.example.datn.dto.request.ProductDetailIdsRequest;
import com.example.datn.dto.request.ProductDetailRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.PriceDiscrepancyResponse;
import com.example.datn.dto.response.ProductDetailResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.ProductDetail;
import com.example.datn.entity.Size;
import com.example.datn.service.ProductDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/product-detail")
public class ProductDetailController {

        @Autowired
        ProductDetailService service;

        private static final Logger logger = LoggerFactory.getLogger(ProductDetailController.class); // Thêm logger

        @PostMapping("/add-multiple/{productId}")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> addProductDetail(
                        @PathVariable("productId") Integer productId,
                        @RequestBody List<ProductDetailRequest> requests) {

                List<ProductDetailResponse> listResponse = service.createProductDetails(productId, requests);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Product detail created successfully",
                                listResponse);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getAll() {

                List<ProductDetailResponse> responseList = service.getAll();

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Retrieved successfully",
                                responseList);

                return ResponseEntity.ok(response);
        }

        @GetMapping("bin-details/{productId}")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getBinDetails(
                @PathVariable("productId") Integer productId
        ) {

                List<ProductDetailResponse> responseList = service.getBin(productId);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Retrieved successfully",
                        responseList);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{pdId}/restore")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> restoreProductQuantity(
                @PathVariable("pdId") Integer pdId,
                @RequestBody Map<String, Integer> request) {

                // Kiểm tra quantity trong request
                Integer quantity = request.get("quantity");
                if (quantity == null) {
                        throw new IllegalArgumentException("Số lượng khôi phục (quantity) là bắt buộc");
                }

                // Gọi service để khôi phục số lượng
                ProductDetailResponse response = service.restoreProductQuantity(pdId, quantity);

                // Tạo phản hồi
                ApiResponse<ProductDetailResponse> apiResponse = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Khôi phục số lượng tồn kho thành công",
                        response
                );

                return ResponseEntity.ok(apiResponse);
        }

        @GetMapping("/{productId}")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getProductDetailsByProductId(
                        @PathVariable("productId") Integer productId) {

                List<ProductDetailResponse> productDetails = service.getProductDetailsByProductId(productId);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                200,
                                "List product detail by id: " + productId,
                                productDetails);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{pdId}")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProductDetail(
                        @PathVariable("pdId") Integer pdId,
                        @RequestBody ProductDetailRequest request) {

                ProductDetailResponse productDetailResponse = service.updateProductDetail(pdId, request);

                ApiResponse<ProductDetailResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                productDetailResponse);

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{productId}/update-list")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> updateProductDetails(
                        @PathVariable Integer productId,
                        @RequestBody List<ProductDetailRequest> requests) {

                List<ProductDetailResponse> list = service.updateProductDetails(productId, requests);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                list);

                return ResponseEntity.ok(response);
        }

        @PatchMapping("/{pdId}/update-qr")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> updateQR(
                        @PathVariable("pdId") Integer pdId) {

                ProductDetailResponse productDetailResponse = service.updateQR(pdId);

                ApiResponse<ProductDetailResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Updated successfully",
                                productDetailResponse);

                return ResponseEntity.ok(response);
        }
        
        @GetMapping("/sizes-by-color/{productId}/{colorId}")
        public ResponseEntity<ApiResponse<List<Size>>> getSizesByProductAndColor(
                @PathVariable("productId") Integer productId,
                @PathVariable("colorId") Integer colorId) {

                List<Size> sizes = service.getSizesByProductIdAndColor(productId, colorId);

                ApiResponse<List<Size>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Sizes retrieved successfully",
                        sizes
                );

                return ResponseEntity.ok(response);
        }

        @GetMapping("/find-by-attributes")
        public ResponseEntity<ApiResponse<ProductDetailResponse>> getDetailByAttributes(
                @RequestParam(value = "productId", required = false) Integer productId,
                @RequestParam(value = "colorId", required = false) Integer colorId,
                @RequestParam(value = "sizeId", required = false) Integer sizeId) {

                ProductDetailResponse response = service.getDetailByAttributes(productId, colorId, sizeId);

                ApiResponse<ProductDetailResponse> apiResponse = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Product detail retrieved successfully",
                        response
                );

                return ResponseEntity.ok(apiResponse);
        }

        @PatchMapping("/update-status/{id}")
        public ResponseEntity<ProductDetailResponse> deleteAndRestoreProductDetail(@PathVariable("id") Integer pdId){
                ProductDetailResponse productDetailResponse = service.deleteAndRestoreProductDetail(pdId);
                return ResponseEntity.ok(productDetailResponse);
        }

        @PostMapping("/delete-or-restore")
        public ResponseEntity<List<ProductDetailResponse>> restoreProductDetails(@RequestBody List<Integer> pdIds) {
                List<ProductDetailResponse> responses = service.deleteAndRestoreProductDetails(pdIds);
                return ResponseEntity.ok(responses);
        }

        @PostMapping("/check-stock")
        public ResponseEntity<ApiResponse<Map<Integer, Integer>>> checkStockAvailability(
                @RequestBody List<Map<String, Integer>> checkStockRequests) {

                if (checkStockRequests == null || checkStockRequests.isEmpty()) {
                        throw new IllegalArgumentException("Danh sách kiểm tra tồn kho không được trống");
                }

                for (Map<String, Integer> request : checkStockRequests) {
                        if (request.get("productDetailId") == null) {
                                throw new IllegalArgumentException("Thiếu productDetailId trong request");
                        }
                }

                Map<Integer, Integer> stockAvailability = service.checkStockAvailability(checkStockRequests);

                ApiResponse<Map<Integer, Integer>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Stock availability checked successfully",
                        stockAvailability
                );
                return ResponseEntity.ok(response);
        }

        @GetMapping("{id}/related")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getRelatedProducts(
                @PathVariable("id") Integer productId) {

                List<ProductDetailResponse> productDetails = service.getRelatedProducts(productId);

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        200,
                        "List product detail related by id: " + productId,
                        productDetails);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/search-ai")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> searchProductAI(
                @RequestParam(value = "query", required = false) String query,
                @RequestParam(value = "brandName", required = false) String brand,
                @RequestParam(value = "colorName", required = false) String color,
                @RequestParam(value = "sizeName", required = false) String size,
                @RequestParam(value = "minPrice", required = false) Double minPrice,
                @RequestParam(value = "maxPrice", required = false) Double maxPrice,
                @RequestParam(value = "categoryName", required = false) String category,
                @RequestParam(value = "materialName", required = false) String material) {

                List<ProductDetailResponse> results = service.searchProducts(
                        query, brand, color, size, minPrice, maxPrice, category, material);

                return ResponseEntity.ok(new ApiResponse<>(
                        200,
                        "Products retrieved successfully",
                        results
                ));
        }
        @PostMapping("/by-ids")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getProductDetailsByIds(
                @RequestBody ProductDetailIdsRequest request) {
                logger.info("Nhận yêu cầu lấy chi tiết sản phẩm cho các ID: {}", request.getProductDetailIds());

                if (request == null || request.getProductDetailIds() == null || request.getProductDetailIds().isEmpty()) {
                        logger.warn("Yêu cầu không hợp lệ: productDetailIds là null hoặc rỗng");
                        throw new IllegalArgumentException("Danh sách ID không được rỗng");
                }

                List<ProductDetailResponse> productDetails = service.getProductDetailsByIds(request.getProductDetailIds());

                logger.info("Lấy thành công {} chi tiết sản phẩm", productDetails.size());

                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy chi tiết sản phẩm thành công",
                        productDetails);

                return ResponseEntity.ok(response);
        }
        @PostMapping("/batch")
        public ResponseEntity<ApiResponse<List<ProductDetailResponse>>> getProductDetailsByIdsBatch(
                @RequestBody Map<String, List<Integer>> request) {
                List<Integer> productDetailIds = request.get("productDetailIds");
                if (productDetailIds == null || productDetailIds.isEmpty()) {
                        throw new IllegalArgumentException("Danh sách ID không được rỗng");
                }
                List<ProductDetailResponse> productDetails = service.getProductDetailsByIds(productDetailIds);
                ApiResponse<List<ProductDetailResponse>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Retrieved product details successfully",
                        productDetails);
                return ResponseEntity.ok(response);
        }
        @PostMapping("/check-prices")
        public ResponseEntity<ApiResponse<List<PriceDiscrepancyResponse>>> checkPriceDiscrepancies(
                @RequestBody List<PriceCheckRequest> requests) {

                if (requests == null || requests.isEmpty()) {
                        throw new IllegalArgumentException("Danh sách kiểm tra giá không được trống");
                }

                // Kiểm tra và bổ sung thông tin sản phẩm
                List<PriceDiscrepancyResponse> responses = service.checkPriceDiscrepancies(requests);

                // Lấy thông tin chi tiết sản phẩm
                List<Integer> productDetailIds = responses.stream()
                        .map(PriceDiscrepancyResponse::getProductDetailId)
                        .collect(Collectors.toList());

                Map<Integer, ProductDetail> productDetails = service.getProductDetailsMap(productDetailIds);

                // Cập nhật thông tin sản phẩm vào response
                responses.forEach(response -> {
                        ProductDetail detail = productDetails.get(response.getProductDetailId());
                        if (detail != null) {
                                response.setProductName(detail.getProduct().getProductName());
                                response.setColor(detail.getColor().getColorName());
                                response.setSize(detail.getSize().getSizeName());
                        }
                });

                ApiResponse<List<PriceDiscrepancyResponse>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Price discrepancies checked successfully",
                        responses
                );

                return ResponseEntity.ok(response);
        }
}