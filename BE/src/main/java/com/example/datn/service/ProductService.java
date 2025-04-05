package com.example.datn.service;

import com.example.datn.controller.WebSocketController;
import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.*;
import com.example.datn.entity.Color;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ProductMapper;
import com.example.datn.repository.*;
import com.example.datn.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    ProductRepository repository;

    @Autowired
    ProductMapper mapper;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    ColorRepository colorRepository;

    @Autowired
    SizeRepository sizeRepository;

    @Autowired
    ProductColorRepository productColorRepository;

    @Autowired
    WebSocketController webSocketController;

    @Autowired
    ProductUpdateRepository productUpdateRepository;

    @Scheduled(fixedRate = 5000) // Kiểm tra mỗi 5 giây
    @Transactional
    public void checkProductQuantityUpdates() {
        List<ProductUpdate> updates = productUpdateRepository.findLatestUpdates();

        for (ProductUpdate update : updates) {
            webSocketController.sendProductQuantityUpdate(update.getProductCode(), update.getNewTotalQuantity());
        }

        // Xóa sau khi gửi thông báo để tránh lặp lại
        productUpdateRepository.deleteAll(updates);
    }


    private String generateProductCode() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String nanoTime = String.valueOf(System.nanoTime()).substring(8); // Lấy 4 chữ số cuối của nanoTime
        return "P" + timestamp + nanoTime;
    }

    public ProductResponse createProduct(ProductRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Material not found with ID: " + request.getMaterialId()));

        Product product = mapper.toProduct(request);

        product.setProductCode(generateProductCode());
        product.setBrand(brand);
        product.setCategory(category);
        product.setMaterial(material);

        return mapper.toProductResponse(repository.save(product));
    }

//    public Page<ProductResponse> getAll(Pageable pageable) {
//        return repository.findAll(pageable).map(mapper::toProductResponse);
//    }

    public Page<ProductResponse> getAll(Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.statusNotTwo());

        Pageable sortedByIdDesc = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("id").descending()
        );
        return repository.findAll(spec, sortedByIdDesc).map(mapper::toProductResponse);
    }

    public List<ProductResponse> getList() {
        Specification<Product> spec = ProductSpecification.statusNotTwo();

        List<Product> products = repository.findAll(spec);
        return mapper.toListProductResponse(products);
    }

    public Page<ProductResponse> searchProducts(String name, Integer brandId, Integer categoryId, Integer materialId,
                                                Integer status, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasName(name))
                .and(ProductSpecification.hasBrandId(brandId))
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.hasMaterialId(materialId))
                .and(ProductSpecification.hasStatus(status))
                .and(ProductSpecification.statusNotTwo());

        Pageable sortedByIdDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by("id").descending());

        return repository.findAll(spec, sortedByIdDesc).map(mapper::toProductResponse);
    }

    public Page<ProductResponse> getBin(Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasStatusTwo());

        Pageable sortedByIdDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by("id").descending());

        return repository.findAll(spec, sortedByIdDesc).map(mapper::toProductResponse);
    }

    public ProductResponse getById(Integer id) {

        Product product = repository.findById(id).orElseThrow(
                () -> new RuntimeException("Product not exist"));

        return mapper.toProductResponse(product);
    }

    public ProductResponse updateProduct(Integer id, ProductRequest request) {

        Product product = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material not found with ID: " + id));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Material not found with ID: " + request.getMaterialId()));

        mapper.updateProduct(product, request);

        product.setBrand(brand);
        product.setCategory(category);
        product.setMaterial(material);

        LocalDateTime now = LocalDateTime.now().withNano(0);

        product.setUpdatedAt(now);

        return mapper.toProductResponse(repository.save(product));
    }

    public ProductResponse updateStatus(Integer productId, Integer status) {
        Product product = repository.findById(productId).orElseThrow(() -> new RuntimeException("Product not exist"));

        product.setStatus(status);

        repository.save(product);

        List<ProductDetail> productDetails = productDetailRepository.findByProductId(productId);

        for (ProductDetail detail : productDetails) {
            if (status == 2) {
                detail.setStatus(2);
            } else {
                detail.setStatus(detail.getQuantity() > 0 ? 1 : 0);
            }
        }

        productDetailRepository.saveAll(productDetails);

        return mapper.toProductResponse(product);
    }

    @Transactional
    public List<ProductResponse> updateMultipleStatuses(List<Integer> productIds) {
        List<Product> products = repository.findAllById(productIds);

        if (products.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm nào với các ID đã cung cấp");
        }

        // Tìm tất cả ProductDetail cùng lúc để tránh query nhiều lần
        List<ProductDetail> allDetails = productDetailRepository.findByProductIdIn(productIds);
        Map<Integer, List<ProductDetail>> detailMap = allDetails.stream()
                .collect(Collectors.groupingBy(detail -> detail.getProduct().getId()));

        for (Product product : products) {
            List<ProductDetail> productDetails = detailMap.getOrDefault(product.getId(), new ArrayList<>());

            boolean allDetailsInactive = productDetails.stream().allMatch(d -> d.getStatus() == 2);

            if (product.getStatus() != 2) {
                product.setStatus(2);
            } else {
                product.setStatus((product.getTotalQuantity() > 0 && !allDetailsInactive) ? 1 : 0);
            }

            for (ProductDetail detail : productDetails) {
                if (detail.getStatus() != 2) {
                    detail.setStatus(2);
                } else {
                    detail.setStatus(detail.getQuantity() > 0 ? 1 : 0);
                }
            }
        }

        // Lưu tất cả thay đổi một lần để tối ưu hiệu suất
        productDetailRepository.saveAll(allDetails);
        repository.saveAll(products);

        return mapper.toListProductResponse(products);
    }


    // public List<ProductResponse> getActiveProducts(){
    //
    // List<Product> productList = repository.findByStatus(1);
    //
    // return mapper.toListProduct(productList);
    // }
    //
    // public List<ProductResponse> getInactiveProducts(){
    //
    // List<Product> productList = repository.findByStatus(0);
    //
    // return mapper.toListProduct(productList);
    // }

    private double getCellValueAsDouble(Cell cell) {
        if (cell == null) {
            return 0.0; // Nếu ô trống, trả về 0.0
        }
        try {
            switch (cell.getCellType()) {
                case NUMERIC:
                    return cell.getNumericCellValue();
                case STRING:
                    return Double.parseDouble(cell.getStringCellValue().trim());
                case FORMULA:
                    if (cell.getCachedFormulaResultType() == CellType.NUMERIC) {
                        return cell.getNumericCellValue();
                    }
                    return 0.0;
                case BOOLEAN:
                    return cell.getBooleanCellValue() ? 1.0 : 0.0;
                default:
                    return 0.0;
            }
        } catch (NumberFormatException e) {
            System.err.println("Lỗi chuyển đổi số thực: " + e.getMessage());
            return 0.0;
        }
    }

    public List<Product> getProductsByIds(List<Integer> productIds) {
        return repository.findAllById(productIds);
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return ""; // Nếu ô trống, trả về chuỗi rỗng
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                double numericValue = cell.getNumericCellValue();
                if (numericValue == (int) numericValue) {
                    return String.valueOf((int) numericValue); // Nếu là số nguyên, ép kiểu về int để bỏ .0
                }
                return String.valueOf(numericValue);
            case FORMULA:
                return cell.getCachedFormulaResultType() == CellType.NUMERIC
                        ? String.valueOf(cell.getNumericCellValue())
                        : cell.getStringCellValue();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private int getCellValueAsInt(Cell cell) {
        if (cell == null) {
            return 0;
        }
        try {
            switch (cell.getCellType()) {
                case NUMERIC:
                    return (int) cell.getNumericCellValue();
                case STRING:
                    return Integer.parseInt(cell.getStringCellValue().trim());
                case FORMULA:
                    return cell.getCachedFormulaResultType() == CellType.NUMERIC
                            ? (int) cell.getNumericCellValue()
                            : 0;
                case BOOLEAN:
                    return cell.getBooleanCellValue() ? 1 : 0;
                default:
                    return 0;
            }
        } catch (NumberFormatException e) {
            System.err.println("Lỗi chuyển đổi số nguyên: " + e.getMessage());
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<?> importProductsFromExcel(MultipartFile file) throws IOException {
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        if (sheet.getPhysicalNumberOfRows() == 0 || sheet.getLastRowNum() == 0) {
            workbook.close();
            return ResponseEntity.ok(Map.of("error", "Không có dữ liệu trong file Excel."));
        }

        List<ProductDetail> productDetails = new ArrayList<>();
        Map<Product, Integer> productTotalQuantities = new HashMap<>();
        List<String> errors = new ArrayList<>();
        List<Row> errorRows = new ArrayList<>();

        for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Bỏ qua dòng tiêu đề
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String productName = getCellValueAsString(row.getCell(0));
            String brandName = getCellValueAsString(row.getCell(1));
            String categoryName = getCellValueAsString(row.getCell(2));
            String materialName = getCellValueAsString(row.getCell(3));
            String description = getCellValueAsString(row.getCell(4));

            String colorName = getCellValueAsString(row.getCell(5));
            String sizeName = getCellValueAsString(row.getCell(6));
            int quantity = getCellValueAsInt(row.getCell(7));
            double price = getCellValueAsDouble(row.getCell(8));

            if (productName.isEmpty() || brandName.isEmpty() || categoryName.isEmpty() ||
                    materialName.isEmpty() || colorName.isEmpty() || sizeName.isEmpty() || quantity < 0 || price <= 0) {
                errors.add("Lỗi dòng " + (i + 1) + ": Dữ liệu không hợp lệ.");
                errorRows.add(row);
                continue;
            }

            // ✅ Tìm hoặc tạo mới Brand, Category, Material
            Brand brand = brandRepository.findByBrandName(brandName)
                    .orElseGet(() -> {
                        Brand newBrand = new Brand();
                        newBrand.setBrandName(brandName);
                        newBrand.setStatus(1);
                        return brandRepository.save(newBrand);
                    });

            // ✅ Tìm hoặc tạo mới Category
            Category category = categoryRepository.findByCategoryName(categoryName)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setCategoryName(categoryName);
                        newCategory.setStatus(1);
                        return categoryRepository.save(newCategory);
                    });

            // ✅ Tìm hoặc tạo mới Material
            Material material = materialRepository.findByMaterialName(materialName)
                    .orElseGet(() -> {
                        Material newMaterial = new Material();
                        newMaterial.setMaterialName(materialName);
                        newMaterial.setStatus(1);
                        return materialRepository.save(newMaterial);
                    });

            // ✅ Tìm hoặc tạo mới Product
            Product product = repository.findByProductNameAndBrandAndCategoryAndMaterial(
                    productName, brand, category, material
            ).orElseGet(() -> {
                Product newProduct = new Product();

                newProduct.setProductCode(generateProductCode());
                newProduct.setProductName(productName);
                newProduct.setBrand(brand);
                newProduct.setCategory(category);
                newProduct.setMaterial(material);
                newProduct.setDescription(description);
                newProduct.setMainImage("image.png");
                newProduct.setTotalQuantity(0); // Đặt tạm thời
                newProduct.setStatus(0); // Đặt tạm thời
                newProduct.setCreatedAt(LocalDateTime.now().withNano(0));
                return repository.save(newProduct);
            });

            // ✅ Tìm hoặc tạo mới Color, Size
            Color color = colorRepository.findByColorName(colorName)
                    .orElseGet(() -> {
                        Color newColor = new Color();
                        newColor.setColorName(colorName);
                        newColor.setStatus(1);
                        return colorRepository.save(newColor);
                    });

            // ✅ Tìm hoặc tạo mới Size
            Size size = sizeRepository.findBySizeName(sizeName)
                    .orElseGet(() -> {
                        Size newSize = new Size();
                        newSize.setSizeName(sizeName);
                        newSize.setStatus(1);
                        return sizeRepository.save(newSize);
                    });

            ProductColor productColor = productColorRepository.findByProductAndColor(product, color)
                    .orElseGet(() -> {
                        ProductColor newProductColor = new ProductColor();
                        newProductColor.setProduct(product);
                        newProductColor.setColor(color);
                        return productColorRepository.save(newProductColor);
                    });

            // ✅ Kiểm tra ProductDetail đã tồn tại chưa
            ProductDetail productDetail = productDetailRepository.findByProductAndColorAndSize(
                    product, color, size
            ).orElse(null);

            if (productDetail == null) {
                // Nếu chưa có, tạo mới
                productDetail = new ProductDetail();
                productDetail.setProduct(product);
                productDetail.setColor(color);
                productDetail.setSize(size);
                productDetail.setPrice(price);
                productDetail.setQuantity(quantity);
                productDetail.setStatus(quantity > 0 ? 1 : 0); // Nếu có số lượng, đặt trạng thái là 1
                productDetail.setCreatedAt(LocalDateTime.now().withNano(0));
                productDetail.setQr("");
            } else {
                productDetail.setQuantity(productDetail.getQuantity() + quantity);
                productDetail.setStatus(productDetail.getQuantity() > 0 ? 1 : 0); // Nếu số lượng > 0, đặt trạng thái 1
            }

            productDetails.add(productDetail);

            productTotalQuantities.put(product, productTotalQuantities.getOrDefault(product, 0) + quantity);
        }

        // ✅ Lưu ProductDetail vào DB
        productDetailRepository.saveAll(productDetails);

        for (ProductDetail pd : productDetails) {
            pd.setQr(String.valueOf(pd.getId()));
        }

        productDetailRepository.saveAll(productDetails);

        // ✅ Cập nhật totalQuantity & status cho Product
        for (Product product : productTotalQuantities.keySet()) {
            int totalQuantityInDB = productDetailRepository.sumQuantityByProduct(product.getId()).orElse(0);
            product.setTotalQuantity(totalQuantityInDB);
            product.setStatus(totalQuantityInDB > 0 ? 1 : 0);
            repository.save(product);
        }

        workbook.close();

        if (!errorRows.isEmpty()) {
            Workbook errorWorkbook = new XSSFWorkbook();
            Sheet errorSheet = errorWorkbook.createSheet("Dòng lỗi");

            // Ghi tiêu đề
            Row header = errorSheet.createRow(0);
            for (int j = 0; j < sheet.getRow(0).getLastCellNum(); j++) {
                header.createCell(j).setCellValue(sheet.getRow(0).getCell(j).getStringCellValue());
            }

            // Ghi các dòng bị lỗi
            int rowNum = 1;
            for (Row errorRow : errorRows) {
                Row newRow = errorSheet.createRow(rowNum++);
                for (int j = 0; j < errorRow.getLastCellNum(); j++) {
                    Cell cell = newRow.createCell(j);
                    if (errorRow.getCell(j) != null) {
                        cell.setCellValue(errorRow.getCell(j).toString());
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            errorWorkbook.write(outputStream);
            errorWorkbook.close();

            // ✅ Trả về danh sách lỗi và file lỗi dưới dạng Base64
            Map<String, Object> response = new HashMap<>();
            response.put("errors", errors);
            response.put("file", Base64.getEncoder().encodeToString(outputStream.toByteArray()));

            return ResponseEntity.status(400).body(response);
        }

        return ResponseEntity.ok(Map.of());
    }
    public  List<Object[]> getTop5ProductsWithLowestQuantity() {
     return repository.findTop5ProductsWithLowestQuantity();

        }
}