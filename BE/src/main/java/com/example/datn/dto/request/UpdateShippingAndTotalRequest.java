package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateShippingAndTotalRequest {
    Double shippingFee;
    Double totalPrice;
    Double totalPayment;
}
