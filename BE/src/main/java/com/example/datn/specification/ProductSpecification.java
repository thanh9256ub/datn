package com.example.datn.specification;

import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("productName")), "%" + name.toLowerCase() + "%");
    }
    public static Specification<Product> hasNameAi(String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("productName")), "%" + name.toLowerCase() + "%");
    }
    public static Specification<Product> hasBrandName(String  name ) {
        return (root, query, cb) ->
                name  == null ? cb.conjunction() : cb.equal(root.get("brand").get("brandName"), name);
    }
    public static Specification<Product> hasCategoryName(String  name ) {
        return (root, query, cb) ->
                name  == null ? cb.conjunction() : cb.equal(root.get("category").get("categoryName"), name);
    }
    public static Specification<Product> hasMaterialName(String  name ) {
        return (root, query, cb) ->
                name  == null ? cb.conjunction() : cb.equal(root.get("material").get("materialName"), name);
    }


    public static Specification<Product> hasDescription(String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("description")), "%" + name.toLowerCase() + "%");
    }
    public static Specification<Product> hasBrandId(Integer brandId) {
        return (root, query, cb) ->
                brandId == null ? cb.conjunction() : cb.equal(root.get("brand").get("id"), brandId);
    }

    public static Specification<Product> hasCategoryId(Integer categoryId) {
        return (root, query, cb) ->
                categoryId == null ? cb.conjunction() : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasMaterialId(Integer materialId) {
        return (root, query, cb) ->
                materialId == null ? cb.conjunction() : cb.equal(root.get("material").get("id"), materialId);
    }

    public static Specification<Product> hasStatus(Integer status) {
        return (root, query, cb) ->
                status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Product> statusNotTwo() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("status"), 2);
    }

    public static Specification<Product> hasStatusTwo() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), 2);
    }
    public static Specification<ProductDetail> hasPrice(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isEmpty()) {
                return cb.conjunction();
            }

            try {

                Double price = Double.parseDouble(name);
                return cb.equal(root.get("price"), price);
            } catch (NumberFormatException e) {

                return cb.conjunction();
            }
        };
    }
    public static Specification<ProductDetail> hasColor (String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("color").get("colorName")),  name);
    }
    public static Specification<ProductDetail> hasSize (String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("size").get("sizeName")),  name);
    }
    public static Specification<ProductDetail> hasStatusPDTwo() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), 1 );
    }
}
