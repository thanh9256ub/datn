package com.example.datn.mapper;

import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.VoucherResponse;
import com.example.datn.entity.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

    Voucher voucher(VoucherRequest request);

    VoucherResponse voucherResponse(Voucher voucher);

    List<VoucherResponse> listResponse(List<Voucher> list);

    @Mapping(target = "id", ignore = true)
    void updateVoucher(@MappingTarget Voucher voucher, VoucherRequest request);
}
