package com.example.ECommerce.Project.V1.Mailing;

import com.example.ECommerce.Project.V1.Model.User;
import org.springframework.web.util.UriComponentsBuilder;

public class AccountVerificationEmailContext extends AbstractEmailContext {

    private String token;

    @Override
    public <T> void init(T context) {
        User user = (User) context;

        put("firstName", user.getUsername());
        setTemplateLocation("mailing/email-verification");
        setSubject("Please Complete Your Confirmation To Access SNS Sytem");
        setFrom("vandung290603@gmail.com");
        setTo(user.getEmail());
    }

    public void setToken(String token) {
        this.token = token;
        put("token", token);
    }

    public void buildVerificationUrl(final String baseURL, final String token) {
        final String url = UriComponentsBuilder.fromHttpUrl(baseURL)
                .path("/home") // Không thêm queryParam("token", token)
                .build()
                .toUriString();
        put("verificationURL", url);
    }

    public void buildVerificationUrlForgotPass(final String baseURL, final String token) {
        final String url = UriComponentsBuilder.fromHttpUrl(baseURL)
                .path("/forgot-password") // Không thêm queryParam("token", token)
                .build()
                .toUriString();
        put("verificationURL", url);
    }
}
