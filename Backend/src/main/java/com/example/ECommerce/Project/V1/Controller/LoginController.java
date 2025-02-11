package com.example.ECommerce.Project.V1.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller()
public class LoginController {

    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model, String error, String logout) {

        if (error != null) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "Invalid username or password");
        }

        return "pages/login";
    }

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody User user) {
//        // Handle the JSON payload (user is deserialized automatically)
//        if ("admin".equals(user.getUsername()) && "admin123".equals(user.getPassword())) {
//            return ResponseEntity.ok("Login successful!");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
//        }
//    }

    @GetMapping("/")
    public String home() {
        return "pages/home";
    }
}
