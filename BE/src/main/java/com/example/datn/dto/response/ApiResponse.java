package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    int status;

    String message;

    T data;

    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
}