package com.abb.Abb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Schema(description = "Les données complètes du tableau de bord d'un client")
public class ClientDashboardDTO {

    @Schema(description = "Nom complet du client", example = "Karim Tazi")
    private String name;

    @Schema(description = "Relevé d'Identité Bancaire (RIB)", example = "350810000000000000000000")
    private String rib;

    @Schema(description = "Nombre total de transactions effectuées", example = "11")
    private int numberOfTransactions;

    @Schema(description = "Solde actuel du compte en MAD", example = "44896.00")
    private BigDecimal solde;

    @Schema(description = "Liste des 5 dernières transactions")
    private List<?> recentTransactions;
}