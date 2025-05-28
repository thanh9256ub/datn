package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCartDetailsRequest {
     Integer productDetailId;
     Integer quantity;
     Double price;
}
