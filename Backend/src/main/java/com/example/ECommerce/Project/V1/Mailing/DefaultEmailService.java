package com.example.ECommerce.Project.V1.Mailing;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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

    @Override
    public void sendOtp(String email, String subject, Integer randomNumber) {
        String[] parts = Integer.toString(randomNumber).split("(?<=.)");
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM, yyyy", Locale.ENGLISH);
        String formattedDate = currentDate.format(formatter);

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);

            StringBuilder htmlContent = new StringBuilder();

            htmlContent.append("<!DOCTYPE html>")
                    .append("<html lang='en'>")
                    .append("<head>")
                    .append("<meta charset='UTF-8'>")
                    .append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                    .append("<title>OTP Verification</title>")
                    .append("</head>")
                    .append("<body style='font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;'>")
                    .append("<h2 style='color: #333;'>SNS System – Password Reset</h2>")
                    .append("<p style='font-size: 16px; color: #555;'>Hello,</p>")
                    .append("<p style='font-size: 16px; color: #555;'>You requested to reset your password on <b>")
                    .append(formattedDate)
                    .append("</b>.</p>")
                    .append("<p style='font-size: 16px; color: #555;'>Please use the following 6-digit OTP code to continue:</p>")
                    .append("<div style='margin: 20px auto; text-align: center;'>");

            for (String digit : parts) {
                htmlContent.append("<span style='display: inline-block; margin: 0 6px; padding: 15px 20px; ")
                        .append("border-radius: 8px; background-color: #ffffff; border: 2px solid #1de9b6; ")
                        .append("font-size: 20px; font-weight: bold;'>")
                        .append(digit)
                        .append("</span>");
            }

            htmlContent.append("</div>")
                    .append("<p style='font-size: 14px; color: #888;'>This OTP is valid for 10 minutes only. Do not share it with anyone.</p>")
                    .append("<p style='font-size: 15px; color: #aaa;'>This is an automated message. Please do not reply.</p>")
                    .append("</body></html>");

            helper.setText(htmlContent.toString(), true);
            emailSender.send(message);

        } catch (MessagingException | MailException e) {
            throw new IllegalArgumentException("Error sending OTP email!", e);
        }
    }
}
