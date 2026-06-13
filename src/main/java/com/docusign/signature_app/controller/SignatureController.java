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
}
