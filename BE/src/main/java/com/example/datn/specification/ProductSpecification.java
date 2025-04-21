package com.example.datn.specification;

import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

    public static Specification<ProductDetail> hasColor(String color) {
        return (root, query, cb) ->
                color == null || color.isEmpty() ? cb.conjunction() :
                        cb.like(cb.lower(root.get("color").get("colorName")), "%" + color.toLowerCase() + "%");
    }

    public static Specification<ProductDetail> hasSize(String size) {
        return (root, query, cb) ->
                size == null || size.isEmpty() ? cb.conjunction() :
                        cb.equal(root.get("size").get("sizeName"), size);
    }

    public static Specification<ProductDetail> priceBetween(Double minPrice, Double maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return cb.conjunction();
            if (minPrice != null && maxPrice != null)
                return cb.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null)
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<ProductDetail> isActiveDetail() {
        return (root, query, cb) -> cb.equal(root.get("status"), 1);
    }

    public static Specification<ProductDetail> matchesAnyKeyword(String keywords) {
        return (root, query, cb) -> {
            if (keywords == null || keywords.isEmpty()) return cb.conjunction();

            String[] terms = keywords.split("\\s+");
            Predicate[] predicates = Arrays.stream(terms)
                    .map(term -> {
                        String lowerTerm = term.toLowerCase();
                        return cb.or(
                                cb.like(cb.lower(root.get("product").get("productName")), "%" + lowerTerm + "%"),
                                cb.like(cb.lower(root.get("product").get("brand").get("brandName")), "%" + lowerTerm + "%"),
                                cb.like(cb.lower(root.get("product").get("category").get("categoryName")), "%" + lowerTerm + "%"),
                                cb.like(cb.lower(root.get("product").get("material").get("materialName")), "%" + lowerTerm + "%"),
                                cb.like(cb.lower(root.get("color").get("colorName")), "%" + lowerTerm + "%"),
                                cb.like(root.get("size").get("sizeName"), "%" + term + "%")
                        );
                    })
                    .toArray(Predicate[]::new);

            return cb.or(predicates);
        };
    }

    public static Specification<ProductDetail> searchProducts(
            String query,
            String brand,
            String color,
            String size,
            Double minPrice,
            Double maxPrice,
            String category,
            String material
    ) {
        return (root, queryBuilder, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Điều kiện status = 1 (active)
            predicates.add(cb.equal(root.get("status"), 1));

            // Điều kiện tìm kiếm chung
            if (query != null && !query.isEmpty()) {
                predicates.add(matchesAnyKeyword(query).toPredicate(root, queryBuilder, cb));
            }

            // Điều kiện hãng
            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("product").get("brand").get("brandName")),
                        "%" + brand.toLowerCase() + "%"
                ));
            }

            // Điều kiện màu sắc
            if (color != null && !color.isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("color").get("colorName")),
                        "%" + color.toLowerCase() + "%"
                ));
            }

            // Điều kiện size
            if (size != null && !size.isEmpty()) {
                predicates.add(cb.equal(
                        root.get("size").get("sizeName"),
                        size
                ));
            }

            // Điều kiện khoảng giá
            if (minPrice != null || maxPrice != null) {
                predicates.add(priceBetween(minPrice, maxPrice).toPredicate(root, queryBuilder, cb));
            }

            // Điều kiện danh mục
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("product").get("category").get("categoryName")),
                        "%" + category.toLowerCase() + "%"
                ));
            }

            // Điều kiện chất liệu
            if (material != null && !material.isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("product").get("material").get("materialName")),
                        "%" + material.toLowerCase() + "%"
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
