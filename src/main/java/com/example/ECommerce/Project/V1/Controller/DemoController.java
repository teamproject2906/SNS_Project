package com.example.ECommerce.Project.V1.Controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/Demo")
public class DemoController {

    @GetMapping("/Endpoint")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint");
    }

    @GetMapping("/Login")
    public ResponseEntity<String> loginForm() throws IOException {
        ClassPathResource htmlFile = new ClassPathResource("/templates/login.html");
        String htmlContent = StreamUtils.copyToString(htmlFile.getInputStream(), StandardCharsets.UTF_8);
        return ResponseEntity.ok().body(htmlContent);
    }
}
