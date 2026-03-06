package com.abb.Abb.service;

import com.abb.Abb.dto.ClientDashboardDTO;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

        ClientDashboardDTO dto = new ClientDashboardDTO();
        dto.setName(client.getName());
        dto.setRib(client.getRib());
        dto.setSolde(client.getSolde());
        dto.setRecentTransactions(recentHistory);

        return dto;
    }
}