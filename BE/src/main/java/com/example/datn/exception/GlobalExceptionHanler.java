package com.example.datn.exception;

import com.example.datn.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHanler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handlerValidationExceptions(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiResponse<Map<String, String>> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(ResourceNotFoundException exception) {

        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.NOT_FOUND.value(),
                "Resource not found",
                exception.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handlerGlobalExceptions(Exception e) {

        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred",
                e.getMessage()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(DataInvalidException.class)
    public ResponseEntity<ApiResponse<String>> handlerDataInvalidExceptions(DataInvalidException e) {

        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                e.getMessage()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
