package com.docusign.signature_app.controller;

import com.docusign.signature_app.model.AuditLog;
import com.docusign.signature_app.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http. HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/audit")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @PostMapping("/log")
    public AuditLog logAction(
            @RequestParam String action,
            @RequestParam String performedBy,
            @RequestParam Long docId,
            HttpServletRequest request
    ) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setDocId(docId);
        log.setIpAddress(request.getRemoteAddr());
        log.setTimestamp(LocalDateTime.now());
        return auditLogRepository.save(log);
    }
    @GetMapping("/{docId}")
    public List<AuditLog> getAuditHistory(@PathVariable Long docId) {
        return auditLogRepository.findByDocId(docId);
    }
}
