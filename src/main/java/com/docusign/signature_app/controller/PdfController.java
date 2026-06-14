package com.docusign.signature_app.controller;

import com.docusign.signature_app.service.PdfSigningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pdf")
public class PdfController {

    @Autowired
    private PdfSigningService pdfSigningService;

    @PostMapping("/sign/{docId}")
    public String signDocument(
            @PathVariable Long docId,
            @RequestParam String filePath,
            @RequestParam double x,
            @RequestParam double y,
            @RequestParam int page,
            @RequestParam String signerName
    ) throws Exception {
        return pdfSigningService.signPdf(filePath, x, y, page, signerName);
    }
}
