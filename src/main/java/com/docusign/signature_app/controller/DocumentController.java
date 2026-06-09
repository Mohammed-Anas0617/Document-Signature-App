package com.docusign.signature_app.controller;

import com.docusign.signature_app.model.Document;
import com.docusign.signature_app.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/document")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
}

@PostMapping("/upload")
public ResponseEntity<Document> uploadDocument(
        @RequestParam("file") MultipartFile file,
        Authentication authentication) throws IOException {

    String username = authentication.getName();
    Document document = documentService.uploadDocument(file, username);
    return ResponseEntity.ok(document);
}
}