package com.example.ECommerce.Project.V1.Mailing;

import jakarta.mail.MessagingException;

public interface EmailService {

    void sendMail(final AbstractEmailContext email) throws MessagingException;

}
