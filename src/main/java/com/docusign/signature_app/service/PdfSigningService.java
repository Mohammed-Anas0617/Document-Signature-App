package com.docusign.signature_app.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;

@Service
public class PdfSigningService {

    public String signPdf(String filePath, double x, double y, int page, String signerName) throws IOException {
        File file = new File(filePath);
        PDDocument document = Loader.loadPDF(file);

        PDPage pdPage = document.getPage(page - 1);
        PDPageContentStream content = new PDPageContentStream(
                document, pdPage, PDPageContentStream.AppendMode.APPEND, true
        );
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        content.newLineAtOffset((float) x, (float) (pdPage.getMediaBox().getHeight() - y));
        content.showText("Signed by: " + signerName);
        content.endText();
        content.close();

        String signedPath = filePath.replace(".pdf", "_signed.pdf");
        document.save(signedPath);
        document.close();

        return signedPath;
    }
}
