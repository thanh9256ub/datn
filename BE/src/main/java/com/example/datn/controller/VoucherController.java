package com.example.datn.controller;

import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.VoucherResponse;
import com.example.datn.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("vouchers")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<VoucherResponse>> addVoucher(@Valid @RequestBody VoucherRequest request) throws IOException {

        VoucherResponse voucherResponse = voucherService.createVoucher(request);

        ApiResponse<VoucherResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", voucherResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAll(){

        List<VoucherResponse> list = voucherService.getAll();

        ApiResponse<List<VoucherResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Voucher retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getActive(){

        List<VoucherResponse> list = voucherService.getActive();

        ApiResponse<List<VoucherResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Voucher retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/bin")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getBin(){

        List<VoucherResponse> list = voucherService.getBin();

        ApiResponse<List<VoucherResponse>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Voucher retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getOne(@PathVariable("id") Integer id){

        VoucherResponse voucherResponse = voucherService.getVoucherById(id);

        return ResponseEntity.ok(voucherResponse);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(

            @PathVariable("id") Integer id,
            @Valid @RequestBody VoucherRequest request){

        VoucherResponse voucherResponse = voucherService.updateVoucher(id, request);
         voucherService.updateVoucherStatus0();
        ApiResponse<VoucherResponse> response = new ApiResponse<>(
                
                HttpStatus.OK.value(),
                "Voucher updated successfully",
                voucherResponse
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{voucherCode}")
    public ResponseEntity<ApiResponse<VoucherResponse>> getByCode(@PathVariable String voucherCode) {
        VoucherResponse voucherResponse = voucherService.getVoucherByCode(voucherCode);

        ApiResponse<VoucherResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Voucher retrieved successfully",
                voucherResponse
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/delete-or-restore")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> deleteOrRestore(@RequestBody List<Integer> vcIds) {
        List<VoucherResponse> voucherResponse = voucherService.deleteOrRestoreVoucher(vcIds);

        ApiResponse<List<VoucherResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Successfully",
                voucherResponse
        );

        return ResponseEntity.ok(response);
    }
}