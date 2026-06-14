package com.docusign.signature_app.repository;

import com.docusign.signature_app.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByDocId(Long docId);
}
