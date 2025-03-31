package com.example.datn.specification;

import com.example.datn.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("productName")), "%" + name.toLowerCase() + "%");
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
}
