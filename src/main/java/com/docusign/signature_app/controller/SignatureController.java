package com.docusign.signature_app.controller;

import com.docusign.signature_app.model.Signature;
import com.docusign.signature_app.repository.SignatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/signature")
public class SignatureController {

    @Autowired
    private SignatureRepository signatureRepository;

    @PostMapping
    public Signature saveSignature(@RequestBody Signature signature) {
        signature.setStatus("PENDING");
        return signatureRepository.save(signature);
    }

    @GetMapping("/{docId}")
    public List<Signature> getSignatures(@PathVariable Long docId) {
        return signatureRepository.findByDocId(docId);
    }

    @PutMapping("/{id}/sign")
    public Signature signDocument(@PathVariable Long id) {
        Signature signature = signatureRepository.findById(id).orElseThrow();
        signature.setStatus("SIGNED");
        return signatureRepository.save(signature);
    }

    @PutMapping("/{id}/reject")
    public Signature rejectDocument(
            @PathVariable Long id,
            @RequestParam String reason
    ) {
        Signature signature = signatureRepository.findById(id).orElseThrow();
        signature.setStatus("REJECTED");
        signature.setRejectionReason(reason);
        return signatureRepository.save(signature);
    }
}

