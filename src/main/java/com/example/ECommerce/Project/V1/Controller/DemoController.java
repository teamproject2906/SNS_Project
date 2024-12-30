package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.User;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/LoginJSON")
    public ResponseEntity<String> login(@RequestBody User user) {
        // Handle the JSON payload (user is deserialized automatically)
        if ("admin".equals(user.getUsername()) && "admin123".equals(user.getPassword())) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }
    }
}
