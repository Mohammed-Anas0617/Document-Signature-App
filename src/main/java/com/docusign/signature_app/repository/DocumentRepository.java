package com.docusign.signature_app.repository;

import com.docusign.signature_app.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document , Long> {
    List<Document> findByUploadedBy(String uploadedBy);
}
