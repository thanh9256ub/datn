package com.example.datn.controller;

import com.example.datn.dto.request.ExportExcelRequest;
import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Product;
import com.example.datn.excel.ExcelExporter;
import com.example.datn.mapper.ProductMapper;
import com.example.datn.repository.ProductDetailRepository;
import com.example.datn.service.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("products")
public class ProductController {

        private final ProductService service;

        @Autowired
        public ProductController(ProductService service) {
                this.service = service;
        }

        @Autowired
        ProductMapper productMapper;

        @Autowired
        private ProductDetailRepository productDetailRepository;

        @PostMapping("add")
        public ResponseEntity<ApiResponse<ProductResponse>> addProduct(
                        @Valid @RequestBody ProductRequest request) {

                ProductResponse productResponse = service.createProduct(request);

                ApiResponse<ProductResponse> response = new ApiResponse<>(
                                HttpStatus.CREATED.value(),
                                "Created successfully",
                                productResponse);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping("list")
        public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {

                List<ProductResponse> list = service.getList();

                ApiResponse<List<ProductResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Products retrieved successfully",
                                list);

                return ResponseEntity.ok(response);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAll(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "5") int size) {

                Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
                Page<ProductResponse> list = service.getAll(pageable);

                ApiResponse<Page<ProductResponse>> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Products retrieved successfully",
                                list);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/bin")
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getBin(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "5") int size) {

                Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
                Page<ProductResponse> list = service.getBin(pageable);

                ApiResponse<Page<ProductResponse>> response = new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Products retrieved successfully",
                        list);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable("id") Integer id) {

                ProductResponse productResponse = service.getById(id);

                ApiResponse<ProductResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Successfully",
                                productResponse);

                return ResponseEntity.ok(response);

        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
                        @Valid @RequestBody ProductRequest request,
                        @PathVariable("id") Integer id) {

                ProductResponse productResponse = service.updateProduct(id, request);

                ApiResponse<ProductResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Product updated successfully",
                                productResponse);

                return ResponseEntity.ok(response);
        }

        @PatchMapping("/{productId}")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(
                        @PathVariable("productId") Integer productId,
                        @RequestParam("status") Integer status) {

                ProductResponse productResponse = service.updateStatus(productId, status);

                ApiResponse<ProductResponse> response = new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Update status successfully",
                                productResponse);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> searchProducts(
                        @RequestParam(value = "name", required = false) String name,
                        @RequestParam(value = "brandId", required = false) Integer brandId,
                        @RequestParam(value = "categoryId", required = false) Integer categoryId,
                        @RequestParam(value = "materialId", required = false) Integer materialId,
                        @RequestParam(value = "status", required = false) Integer status,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "5") int size) {

                Pageable pageable = PageRequest.of(page, size);

                Page<ProductResponse> list = service.searchProducts(name, brandId, categoryId, materialId, status,
                                pageable);

                ApiResponse<Page<ProductResponse>> response = new ApiResponse<>(
                                200,
                                "Products retrieved successfully",
                                list);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/export-excel")
        public void exportToExcel(
                @RequestBody ExportExcelRequest request,
                HttpServletResponse response) throws IOException {

                List<Product> selectedProducts = service.getProductsByIds(request.getProductIds());

                if (selectedProducts.isEmpty()) {
                        throw new RuntimeException("Không tìm thấy sản phẩm nào để xuất Excel!");
                }

                response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                response.setHeader("Content-Disposition", "attachment; filename=danh_sach_san_pham_xuat_excel.xlsx");

                ExcelExporter excelExporter = new ExcelExporter(selectedProducts, productDetailRepository);
                excelExporter.export(response);
        }

        @PostMapping("/import-excel")
        public ResponseEntity<?> importProducts(@RequestParam("file") MultipartFile file) {
                try {
                        if (file.isEmpty()) {
                                return ResponseEntity.badRequest().body("File không được để trống!");
                        }

                        return service.importProductsFromExcel(file);
                } catch (IOException e) {
                        return ResponseEntity.status(500).body("Lỗi khi đọc file: " + e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.status(500).body("Có lỗi xảy ra: " + e.getMessage());
                }
        }

        @PatchMapping("/delete-multiple")
        public ResponseEntity<List<ProductResponse>> updateMultipleStatuses(
                @RequestBody List<Integer> productIds) {
                return ResponseEntity.ok(service.updateMultipleStatuses(productIds));
        }

}