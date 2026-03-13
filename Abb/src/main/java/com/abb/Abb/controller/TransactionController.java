package com.abb.Abb.controller;

import com.abb.Abb.controller.api.TransactionApiDocs;
import com.abb.Abb.dto.TransferRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.service.ExcelService;
import com.abb.Abb.service.PdfService;
import com.abb.Abb.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController implements TransactionApiDocs {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private com.abb.Abb.repository.ClientRepository clientRepository;

    @Override
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Transaction transaction = transactionService.effectuerVirement(email, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Virement effectué avec succès.",
                    "transaction", transaction
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @Override
    @GetMapping("/history")
    public ResponseEntity<?> getTransactionHistory(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Transaction> history = transactionService.getHistoriqueClient(email);
            return ResponseEntity.ok(Map.of(
                    "message", "Historique des transactions récupéré avec succès.",
                    "transactions", history
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @Override
    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportHistoryToPdf(Authentication authentication) {
        String email = authentication.getName();
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<Transaction> history = transactionService.getHistoriqueClient(email);

        byte[] pdfBytes = pdfService.genererRelevePdf(client, history);

        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=releve_bancaire.pdf")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @Override
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportHistoryToExcel(Authentication authentication) {
        String email = authentication.getName();
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<Transaction> history = transactionService.getHistoriqueClient(email);
        byte[] excelBytes = excelService.genererReleveExcel(client, history);

        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=releve_bancaire.xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}