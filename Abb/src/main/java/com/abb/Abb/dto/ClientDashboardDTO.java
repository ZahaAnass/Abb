package com.abb.Abb.dto;

import com.abb.Abb.entity.Transaction;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ClientDashboardDTO {
    private String name;
    private String rib;
    private BigDecimal solde;
    private List<Transaction> recentTransactions;
}