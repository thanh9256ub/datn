package com.example.datn.dto.request;

import com.example.datn.entity.Order;
import com.example.datn.entity.Voucher;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderVoucherRequest {

    Integer orderId ;


    Integer voucherId ;

    String status ;
}
