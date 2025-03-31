package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerProfileResponse {
     String customerId; // ID của khách hàng (có thể là customerCode hoặc id)
     String email;
     String fullName;
     String phone;
     String role;
}
