package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerInfoRequest {
    @NotBlank(message = "Tên khách hàng là bắt buộc")
    private String customerName;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(regexp = "\\d{10,11}", message = "Số điện thoại không hợp lệ")
    private String phone;

    private String address;
}
