package com.abb.Abb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Les statistiques globales pour le tableau de bord administrateur")
public class AdminDashboardDTO {

    @Schema(description = "Nombre total d'employés actifs", example = "15")
    private long totalEmployees;

    @Schema(description = "Nombre total de clients inscrits", example = "60")
    private long totalClients;

    @Schema(description = "Nombre total de transactions effectuées sur le réseau", example = "1248")
    private long totalTransactions;
}