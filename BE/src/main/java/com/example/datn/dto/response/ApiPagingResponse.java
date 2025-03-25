package com.example.datn.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiPagingResponse<T> extends ApiResponse<T> {

    int totalPage;

    public ApiPagingResponse(int status, String message, T data, int totalPage) {
        super(status, message, data);
        this.totalPage = totalPage;
    }

}