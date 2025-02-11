package com.example.datn.mapper;

import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.VoucherRespone;
import com.example.datn.entity.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

    Voucher voucher(VoucherRequest request);

    VoucherRespone voucherRepson(Voucher voucher);

    List<VoucherRespone> listVoucher(List<Voucher> list);

    @Mapping(target = "id", ignore = true)
    void updateVoucher(@MappingTarget Voucher voucher, VoucherRequest request);
}
