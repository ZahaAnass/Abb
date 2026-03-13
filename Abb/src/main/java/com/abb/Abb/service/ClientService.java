package com.abb.Abb.service;

import com.abb.Abb.dto.ClientDashboardDTO;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public ClientDashboardDTO getDashboardData(String email) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client introuvable."));

        List<Transaction> recentHistory = transactionRepository.findLast5Transactions(client.getRib());

        Integer numberOfTransactions = transactionRepository.countBySenderRibOrReceiverRib(client.getRib(), client.getRib());

        ClientDashboardDTO dto = new ClientDashboardDTO();
        dto.setName(client.getName());
        dto.setRib(client.getRib());
        dto.setSolde(client.getSolde());
        dto.setRecentTransactions(recentHistory);
        dto.setNumberOfTransactions(numberOfTransactions);

        return dto;
    }

    public String generateUniqueRib() {
        Random random = new Random();
        String newRib;

        do {
            StringBuilder sb = new StringBuilder();
            sb.append("350");

            for (int i = 0; i < 21; i++) {
                sb.append(random.nextInt(10));
            }

            newRib = sb.toString();

        } while (clientRepository.existsByRib(newRib));

        return newRib;
    }
}