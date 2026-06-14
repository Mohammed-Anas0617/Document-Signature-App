package com.docusign.signature_app.controller;

import com.docusign.signature_app.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send/{docId}")
    public String sendSigningEmail(
            @PathVariable Long docId,
            @RequestParam String toEmail
    ) {
        String token = UUID.randomUUID().toString();
        String signingLink = "http://localhost:5173/sign?docId=" + docId + "&token=" + token;
        emailService.sendSigningLink(toEmail, signingLink);
        return "Email sent to " + toEmail;
    }
}
