package com.abb.Abb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class TransferRequest {
    private String receiverRib;
    private BigDecimal amount;
    private String description;
}
