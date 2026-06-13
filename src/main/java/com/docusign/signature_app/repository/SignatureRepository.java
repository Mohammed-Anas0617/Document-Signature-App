package com.docusign.signature_app.repository;

import com.docusign.signature_app.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SignatureRepository extends JpaRepository<Signature, Long> {
    List<Signature> findByDocId(Long docId);
}
