package com.example.datn.service;

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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        Pageable sortedByIdDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("id").descending());
        return repository.findAll(sortedByIdDesc).map(mapper::toProductResponse);
    }

    public List<ProductResponse> getList() {
        return mapper.toListProductResponse(repository.findAll());
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

    public void deleteProduct(Integer id) {
        repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + id));

        repository.deleteById(id);
    }

    public ProductResponse updateStatus(Integer productId, Integer status) {
        Product product = repository.findById(productId).orElseThrow(() -> new RuntimeException("Product not exist"));

        product.setStatus(status);

        return mapper.toProductResponse(repository.save(product));
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

    public Page<ProductResponse> searchProducts(String name, Integer brandId, Integer categoryId, Integer materialId,
            Integer status, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasName(name))
                .and(ProductSpecification.hasBrandId(brandId))
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.hasMaterialId(materialId))
                .and(ProductSpecification.hasStatus(status));

        return repository.findAll(spec, pageable).map(mapper::toProductResponse);
    }

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
                return String.valueOf(cell.getNumericCellValue()); // Chuyển số thành chuỗi
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
    public void importProductsFromExcel(MultipartFile file) throws IOException {
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        List<ProductDetail> productDetails = new ArrayList<>();
        Map<Product, Integer> productTotalQuantities = new HashMap<>();

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


            // ✅ Tìm hoặc tạo mới Brand, Category, Material
            Brand brand = brandRepository.findByBrandName(brandName)
                    .orElseGet(() -> {
                        Brand newBrand = new Brand();
                        newBrand.setBrandName(brandName);
                        return brandRepository.save(newBrand);
                    });

            // ✅ Tìm hoặc tạo mới Category
            Category category = categoryRepository.findByCategoryName(categoryName)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setCategoryName(categoryName);
                        return categoryRepository.save(newCategory);
                    });

            // ✅ Tìm hoặc tạo mới Material
            Material material = materialRepository.findByMaterialName(materialName)
                    .orElseGet(() -> {
                        Material newMaterial = new Material();
                        newMaterial.setMaterialName(materialName);
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
                        return colorRepository.save(newColor);
                    });

            // ✅ Tìm hoặc tạo mới Size
            Size size = sizeRepository.findBySizeName(sizeName)
                    .orElseGet(() -> {
                        Size newSize = new Size();
                        newSize.setSizeName(sizeName);
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
                // Nếu đã có, cập nhật số lượng (cộng dồn)
                productDetail.setQuantity(productDetail.getQuantity() + quantity);
                productDetail.setStatus(productDetail.getQuantity() > 0 ? 1 : 0); // Nếu số lượng > 0, đặt trạng thái 1
            }

            productDetails.add(productDetail);

            // ✅ Cập nhật tổng số lượng của Product
            productTotalQuantities.put(product, productTotalQuantities.getOrDefault(product, 0) + quantity);
        }

        // ✅ Lưu ProductDetail vào DB
        productDetailRepository.saveAll(productDetails);

        for (ProductDetail pd : productDetails) {
            pd.setQr(String.valueOf(pd.getId()));
        }

        productDetailRepository.saveAll(productDetails);

        // ✅ Cập nhật totalQuantity & status cho Product
        for (Map.Entry<Product, Integer> entry : productTotalQuantities.entrySet()) {
            Product product = entry.getKey();
            int updatedTotalQuantity = entry.getValue();
            product.setTotalQuantity(updatedTotalQuantity);
            product.setStatus(updatedTotalQuantity > 0 ? 1 : 0); // Nếu tổng số lượng > 0 thì trạng thái = 1
            repository.save(product);
        }

        workbook.close();
    }


}