package com.example.datn.service;

import com.example.datn.dto.request.ProductRequest;
import com.example.datn.dto.response.ProductResponse;
import com.example.datn.entity.Brand;
import com.example.datn.entity.Category;
import com.example.datn.entity.Material;
import com.example.datn.entity.Product;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.ProductMapper;
import com.example.datn.repository.BrandRepository;
import com.example.datn.repository.CategoryRepository;
import com.example.datn.repository.MaterialRepository;
import com.example.datn.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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

    private boolean isProductCodeExists(String productCode) {
        return repository.findByProductCode(productCode) != null;
    }

    public ProductResponse createProduct(ProductRequest request){

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId()));

        if(isProductCodeExists(request.getProductCode())){
            throw new RuntimeException("Product code already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with ID: " + request.getMaterialId()));

        Product product = mapper.toProduct(request);

        product.setBrand(brand);
        product.setCategory(category);
        product.setMaterial(material);

        return mapper.toProductResponse(repository.save(product));
    }

    public List<ProductResponse> getAll(){
        return mapper.toListProduct(repository.findAll());
    }


    public ProductResponse updateProduct(Integer id, ProductRequest request){

        Product product = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Material not found with ID: " + id)
        );

        if (!product.getProductCode().equals(request.getProductCode()) && isProductCodeExists(request.getProductCode())) {
            throw new RuntimeException("Product code already exists");
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with ID: " + request.getMaterialId()));

        mapper.updateProduct(product, request);

        product.setBrand(brand);
        product.setCategory(category);
        product.setMaterial(material);

        LocalDateTime now = LocalDateTime.now().withNano(0);

        product.setUpdatedAt(now);

        return mapper.toProductResponse(repository.save(product));
    }

    public void deleteProduct(Integer id){
        Product product = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with ID: " + id)
        );

        repository.deleteById(id);
    }
}
