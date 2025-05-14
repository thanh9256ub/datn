package com.example.datn.dto.request;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@Data
@AllArgsConstructor
public class ProductDetailIdsRequest {
    private List<Integer> productDetailIds;
}
