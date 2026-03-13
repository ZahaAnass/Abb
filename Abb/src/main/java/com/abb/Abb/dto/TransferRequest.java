package com.abb.Abb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Schema(description = "Objet représentant une requête de virement bancaire")
public class TransferRequest {

    @Schema(description = "Le RIB du bénéficiaire (compte de destination)", example = "350810000000000000000002")
    private String receiverRib;

    @Schema(description = "Le montant à transférer (en MAD)", example = "1500.00")
    private BigDecimal amount;

    @Schema(description = "Description ou motif du virement", example = "Remboursement restaurant")
    private String description;
}