package com.example.ECommerce.Project.V1.Exception;

public class ImageLimitExceededException extends RuntimeException {


    public ImageLimitExceededException(String message) {
        super(message);
        System.out.println("Message: " + message);
    }
}
