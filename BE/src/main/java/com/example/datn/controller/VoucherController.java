package com.example.datn.controller;

import com.example.datn.dto.request.VoucherRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.VoucherRespone;
import com.example.datn.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("voucher")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<VoucherRespone>> addVoucher(@Valid @RequestBody VoucherRequest request){

        VoucherRespone voucherRespone = voucherService.createVoucher(request);

        ApiResponse<VoucherRespone> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                "Created successfully", voucherRespone);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("list")
    public ResponseEntity<ApiResponse<List<VoucherRespone>>> getAll(){

        List<VoucherRespone> list = voucherService.getAll();

        ApiResponse<List<VoucherRespone>> response = new ApiResponse<>(HttpStatus.OK.value(),
                "Voucher retrieved successfully", list);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherRespone> getOne(@PathVariable("id") Integer id){

        VoucherRespone voucherRespone = voucherService.getVoucherById(id);

        return ResponseEntity.ok(voucherRespone);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<VoucherRespone>> updateVoucher(

            @PathVariable("id") Integer id,
            @Valid @RequestBody VoucherRequest request){

        VoucherRespone voucherRespone = voucherService.updateVoucher(id, request);

        ApiResponse<VoucherRespone> response = new ApiResponse<>(
                
                HttpStatus.OK.value(),
                "Voucher updated successfully",
                voucherRespone
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<VoucherRespone>> deleteVoucher(@PathVariable("id") Integer id){

        voucherService.deleteVoucher(id);

        ApiResponse<VoucherRespone> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Voucher deleted successfully",
                null
        );

        return ResponseEntity.ok(response);

    }
}