package com.example.ECommerce.Project.V1.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404 ,ex.getMessage(), "Resource Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInputException(InvalidInputException ex) {
        ErrorResponse error = new ErrorResponse(400 ,ex.getMessage(), "Invalid Input Provided");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(400 ,ex.getMessage(), "Illegal Argument");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException ex) {
        ErrorResponse error = new ErrorResponse(400 ,ex.getMessage(), "Duplicate Entry Resource");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

//    public ResponseEntity<Object> handleDuplicateResourceException(DuplicateResourceException ex ) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("statusCode", HttpStatus.BAD_REQUEST.value());
//        response.put("message", ex.getMessage());
//        return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
//    }

    @ExceptionHandler(Exception.class) // Fallback for all other exceptions
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse error = new ErrorResponse(500 ,"An unexpected error occurred", ex.getMessage());
        System.out.println(Arrays.toString(ex.getStackTrace()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
