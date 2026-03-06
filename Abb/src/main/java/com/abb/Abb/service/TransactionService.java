package com.abb.Abb.service;

import com.abb.Abb.dto.TransferRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public Transaction effectuerVirement(String senderEmail, TransferRequest request) {

        if (request == null) {
            throw new RuntimeException("La requête de virement est vide.");
        }
        if (request.getReceiverRib() == null || request.getReceiverRib().trim().isEmpty()) {
            throw new RuntimeException("Le RIB du destinataire est obligatoire.");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant du virement doit être strictement positif.");
        }
        if (request.getDescription() != null && request.getDescription().length() > 255) {
            throw new RuntimeException("La description ne peut pas dépasser 255 caractères.");
        }

        Client sender = clientRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Erreur d'authentification de l'expéditeur."));

        if (sender.getRib() == null) {
            throw new RuntimeException("Erreur critique : Le compte expéditeur n'a pas de RIB.");
        }
        if (sender.getSolde() == null) {
            throw new RuntimeException("Erreur critique : Le solde de l'expéditeur est corrompu.");
        }

        if (sender.getSolde().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Solde insuffisant pour effectuer ce virement.");
        }

        Client receiver = clientRepository.findByRib(request.getReceiverRib())
                .orElseThrow(() -> new RuntimeException("Le destinataire n'existe pas."));

        if (sender.getRib().equals(receiver.getRib())) {
            throw new RuntimeException("Vous ne pouvez pas envoyer de l'argent vers votre propre compte.");
        }

        if (receiver.getSolde() == null) {
            receiver.setSolde(BigDecimal.ZERO);
        }

        sender.setSolde(sender.getSolde().subtract(request.getAmount()));
        receiver.setSolde(receiver.getSolde().add(request.getAmount()));

        clientRepository.save(sender);
        clientRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setSenderRib(sender.getRib());
        transaction.setReceiverRib(receiver.getRib());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getHistoriqueClient(String email) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client introuvable."));

        if (client.getRib() == null) {
            return java.util.Collections.emptyList();
        }

        return transactionRepository.findBySenderRibOrReceiverRib(client.getRib(), client.getRib());
    }

}