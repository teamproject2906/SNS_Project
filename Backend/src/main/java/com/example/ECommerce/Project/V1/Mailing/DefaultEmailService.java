package com.example.ECommerce.Project.V1.Mailing;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultEmailService implements EmailService {

    private final JavaMailSender emailSender;

    @Override
    public void sendMail(AbstractEmailContext email) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email.getTo());
        helper.setFrom(email.getFrom());
        helper.setSubject(email.getSubject());

        String content = "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Account Verification</title>" +
                "</head>" +
                "<body style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>" +
                "<h2>Welcome</h2>" +
                "<h1 style='font-size: 24px; color: #333;'>Finish accessing with your Google account.</h1>" +
                "<p style='font-size: 16px;'>Hi " + email.getContext().get("firstName") + ",</p>" +
                "<p style='font-size: 16px; color: #555;'>We're excited to have you get started into SNS System. <br> First, you need to confirm your account. Just press the button below.</p>" +
                "<a href='" + email.getContext().get("verificationURL") + "' " +
                "style='display: inline-block; margin: 20px auto; padding: 12px 24px; background-color: #1de9b6; color: white; font-weight: bold; text-decoration: none; border-radius: 5px;'>Validate Account</a>" +
//                "<p style='font-size: 14px; margin-top: 40px;'>If you experience any issues with the button above,<br/>copy and paste the URL below into your web browser:</p>" +
//                "<p style='font-size: 13px; color: #888; word-break: break-all;'>" + email.getContext().get("verificationURL") + "</p>" +
//                "<hr style='margin-top: 40px;'>" +
                "<p style='font-size: 15px; color: #aaa;'>This is an automated message, please do not reply.</p>" +
                "</body></html>";

        helper.setText(content, true); // true = HTML

        emailSender.send(message);
    }
}
