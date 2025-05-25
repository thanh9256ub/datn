package com.example.datn.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceDiscrepancyResponse {
    private Integer productDetailId;
    private boolean hasDiscrepancy;
    private Double oldPrice;
    private Double newPrice;

    private String productName;
    private String color;
    private String size;
    public PriceDiscrepancyResponse(Integer productDetailId, boolean hasDiscrepancy,
                                    Double oldPrice, Double newPrice) {
        this.productDetailId = productDetailId;
        this.hasDiscrepancy = hasDiscrepancy;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
    }
}
